package com.prasad.moneymanager.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.prasad.moneymanager.dto.ExpenseDTO;
import com.prasad.moneymanager.entity.CategoryEntity;
import com.prasad.moneymanager.entity.ExpenseEntity;
import com.prasad.moneymanager.entity.ProfileEntity;
import com.prasad.moneymanager.repository.CategoryRepository;
import com.prasad.moneymanager.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;
    private final EmailService emailService;


    //Adds a new expense to the database
    public ExpenseDTO addExpense(ExpenseDTO dto){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        ExpenseEntity newExpense = toEntity(dto, profile, category);
        expenseRepository.save(newExpense);
        return toDto(newExpense);
    }

    //Retrives all expenses for current month/based on start and end date
    public List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toDto).toList();
    }

    //Delete expense by id for current user
    public void deleteExpense(Long expenseId){
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity entity = expenseRepository.findById(expenseId)
        .orElseThrow(() -> new RuntimeException("Expense not found"));

        if(!entity.getProfile().getId().equals(profile.getId())){
            throw new RuntimeException("Unauthorized to delete this expense");
        }
        expenseRepository.delete(entity);
    }

    //Get latest 5 expenses for current user
    public List<ExpenseDTO> getLatest5ExpensesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDto).toList();
    }

    //Get total expenses of current user
    public BigDecimal getTotalExpenseForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    //filter expenses
    public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String Keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, Keyword, sort);
        return list.stream().map(this::toDto).toList();
    }

    //Notifications
    public List<ExpenseDTO> getExpensesForUserOnDate(Long profileId, LocalDate date){
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDate(profileId, date);
        return list.stream().map(this::toDto).toList();
    }

    //helper methods
    private ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profile, CategoryEntity category){
        return ExpenseEntity.builder()
        .name(dto.getName())
        .icon(dto.getIcon())
        .amount(dto.getAmount())
        .date(dto.getDate())
        .profile(profile)
        .category(category)
        .build();
    }

    private ExpenseDTO toDto(ExpenseEntity entity){
        return ExpenseDTO.builder()
        .id(entity.getId())
        .name(entity.getName())
        .icon(entity.getIcon())
        .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
        .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : "N?A")
        .amount(entity.getAmount())
        .date(entity.getDate())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
    }

    
    public ByteArrayInputStream generateExpenseExcel() throws IOException {

        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> expenses = expenseRepository.findByProfileId(profile.getId());

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Expenses");

        // Header
        Row header = sheet.createRow(0);
        String[] columns = {"Name", "Amount", "Date", "Category"};

        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        // Data rows
        int rowIdx = 1;
        for (ExpenseEntity expense : expenses) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(expense.getName());
            row.createCell(1).setCellValue(expense.getAmount().doubleValue());
            row.createCell(2).setCellValue(expense.getDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
            row.createCell(3).setCellValue(expense.getCategory() != null ? expense.getCategory().getName() : "");
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    public void emailExpenseExcelToUser() {

        try {
            ProfileEntity profile = profileService.getCurrentProfile();

            ByteArrayInputStream stream = generateExpenseExcel();
            byte[] fileBytes = stream.readAllBytes();

            String base64File = Base64.getEncoder().encodeToString(fileBytes);

            emailService.sendEmailWithAttachment(
                profile.getEmail(),
                "Your Expense Report",
                "<p>Please find attached your expense report.</p>",
                base64File,
                "expense_details.xlsx"
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to email expense report", e);
        }
    }
}
