package com.recommerceAPI.repository;

import java.util.Optional;

import com.recommerceAPI.domain.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long>{

    // User의 이메일을 기반으로 해당 User의 Cart를 조회하는 쿼리 메서드
    @Query("select wishlist from Wishlist wishlist where wishlist.owner.email = :email")
    public Optional<Wishlist> getWishlistOfMember(@Param("email") String email);
    @Transactional
    void deleteByOwnerEmail(String ownerEmail);

    @Query("select wishlist.wno from Wishlist wishlist where wishlist.owner.email = :email")
    Long findWinoByEmail(@Param("email") String email);
}
