package com.prasad.moneymanager.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prasad.moneymanager.service.ExpenseService;
import com.prasad.moneymanager.service.IncomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class ExportController {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;

    //income
    @GetMapping("/download/income")
    public ResponseEntity<byte[]> downloadIncomeExcel() throws IOException {

        ByteArrayInputStream stream = incomeService.generateIncomeExcel();
        byte[] bytes = stream.readAllBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(
            MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        );

        headers.setContentDisposition(
            ContentDisposition.attachment()
                .filename("income_details.xlsx")
                .build()
        );

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }

    @GetMapping("/email/income")
        public ResponseEntity<String> emailIncomeExcel() {

        incomeService.emailIncomeExcelToUser();

        return ResponseEntity.ok("Income details emailed successfully");
    }

    //Expense
    @GetMapping("/download/expense")
    public ResponseEntity<byte[]> downloadExpenseExcel() throws IOException {

        ByteArrayInputStream stream = expenseService.generateExpenseExcel();
        byte[] bytes = stream.readAllBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(
            MediaType.parseMediaType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        );

        headers.setContentDisposition(
            ContentDisposition.attachment()
                .filename("expense_details.xlsx")
                .build()
        );

        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }

    @GetMapping("/email/expense")
        public ResponseEntity<String> emailExpenseExcel() {

        expenseService.emailExpenseExcelToUser();

        return ResponseEntity.ok("Expense details emailed successfully");
    }
}
