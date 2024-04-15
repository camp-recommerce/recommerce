package com.recommerceAPI.repository;

import com.recommerceAPI.domain.SaleList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface SaleListRepository extends JpaRepository<SaleList, Long> {

}
