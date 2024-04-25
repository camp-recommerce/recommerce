package com.recommerceAPI.dto;

import lombok.Data;

@Data
public class PasswordChangeRequestDTO {

    private String currentPassword;

    private String newPassword;
}
