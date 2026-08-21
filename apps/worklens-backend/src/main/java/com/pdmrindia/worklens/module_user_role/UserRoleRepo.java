package com.pdmrindia.worklens.module_user_role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepo extends JpaRepository<Role,Integer> {

    Optional<Role> findById(int id);

    Optional<Role> findByName(String name);

    List<Role> findByNameIn(Collection<String> names);
}
