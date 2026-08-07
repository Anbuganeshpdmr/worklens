package com.pdmrindia.worklens.module_user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmpId(String empId);

    Optional<User> findByEmailId(String emailId);

    List<User> findAll();
}
