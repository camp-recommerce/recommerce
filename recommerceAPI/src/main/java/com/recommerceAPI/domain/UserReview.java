package com.recommerceAPI.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_user_review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @Column(length = 500)
    private String content; // 후기 내용

    private double rating; // 평점

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email")
    private User user; // 후기를 남긴 사용자



    public UserReview(String content, double rating, User user) {
        this.content = content;
        this.rating = rating;
        this.user = user;

    }
}
