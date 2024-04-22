package com.recommerceAPI.dto;

public class UserProfileDTO {
    private String email;
    private String topPurchaseCategory;
    private String topSaleCategory;
    private Double averagePrice;
    private String topSellingLocation;

    public UserProfileDTO(String email, String topPurchaseCategory, String topSaleCategory, Double averagePrice, String topSellingLocation) {
        this.email = email;
        this.topPurchaseCategory = topPurchaseCategory;
        this.topSaleCategory = topSaleCategory;
        this.averagePrice = averagePrice;
        this.topSellingLocation = topSellingLocation;
    }

    // Getters
    public String getEmail() {
        return email;
    }

    public String getTopPurchaseCategory() {
        return topPurchaseCategory;
    }

    public String getTopSaleCategory() {
        return topSaleCategory;
    }

    public Double getAveragePrice() {
        return averagePrice;
    }

    public String getTopSellingLocation() {
        return topSellingLocation;
    }
}