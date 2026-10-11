package com.myapp.aileadqualificationagent.repository.user;


import com.myapp.aileadqualificationagent.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<com.myapp.aileadqualificationagent.model.user.User> findByEmail(String email);

    boolean existsByEmail(String email);
}
