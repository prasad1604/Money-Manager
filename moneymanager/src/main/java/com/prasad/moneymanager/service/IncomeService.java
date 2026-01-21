package com.prasad.moneymanager.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.prasad.moneymanager.dto.IncomeDTO;
import com.prasad.moneymanager.entity.CategoryEntity;
import com.prasad.moneymanager.entity.IncomeEntity;
import com.prasad.moneymanager.entity.ProfileEntity;
import com.prasad.moneymanager.repository.CategoryRepository;
import com.prasad.moneymanager.repository.IncomeRepository;
import java.util.Base64;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final CategoryRepository categoryRepository;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;
    private final EmailService emailService;

    //Adds a new expense to the database
    public IncomeDTO addIncome(IncomeDTO dto){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        IncomeEntity newIncome = toEntity(dto, profile, category);
        incomeRepository.save(newIncome);
        return toDto(newIncome);
    }

    //Retrives all incomes for current month/based on start and end date
    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toDto).toList();
    }

    //Delete income by id for current user
    public void deleteIncome(Long incomeId){
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity entity = incomeRepository.findById(incomeId)
        .orElseThrow(() -> new RuntimeException("Income not found"));

        if(!entity.getProfile().getId().equals(profile.getId())){
            throw new RuntimeException("Unauthorized to delete this income");
        }
        incomeRepository.delete(entity);
    }

    //Get latest 5 incomes for current user
    public List<IncomeDTO> getLatest5IncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDto).toList();
    }

    //Get total incomes of current user
    public BigDecimal getTotalIncomeForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    //filter incomes
    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String Keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, Keyword, sort);
        return list.stream().map(this::toDto).toList();
    }

    //helper methods
    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category){
        return IncomeEntity.builder()
        .name(dto.getName())
        .icon(dto.getIcon())
        .amount(dto.getAmount())
        .date(dto.getDate())
        .profile(profile)
        .category(category)
        .build();
    }

    private IncomeDTO toDto(IncomeEntity entity){
        return IncomeDTO.builder()
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

    public ByteArrayInputStream generateIncomeExcel() throws IOException {

        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> incomes = incomeRepository.findByProfileId(profile.getId());

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Incomes");

        // Header
        Row header = sheet.createRow(0);
        String[] columns = {"Name", "Amount", "Date", "Category"};

        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        // Data rows
        int rowIdx = 1;
        for (IncomeEntity income : incomes) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(income.getName());
            row.createCell(1).setCellValue(income.getAmount().doubleValue());
            row.createCell(2).setCellValue(income.getDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
            row.createCell(3).setCellValue(income.getCategory() != null ? income.getCategory().getName() : "");
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    public void emailIncomeExcelToUser() {

        try {
            ProfileEntity profile = profileService.getCurrentProfile();

            ByteArrayInputStream stream = generateIncomeExcel();
            byte[] fileBytes = stream.readAllBytes();

            String base64File = Base64.getEncoder().encodeToString(fileBytes);

            emailService.sendEmailWithAttachment(
                profile.getEmail(),
                "Your Income Report",
                "<p>Please find attached your income report.</p>",
                base64File,
                "income_details.xlsx"
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to email income report", e);
        }
    }
}
