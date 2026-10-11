package com.myapp.aileadqualificationagent.service.user;

import com.myapp.aileadqualificationagent.model.user.User;
import com.myapp.aileadqualificationagent.repository.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository  userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String email){

       return userRepository.findByEmail(email)
               .orElseThrow(() ->
                       new RuntimeException("User not found"));
    }

    public User getUserById(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow( () ->
                        new RuntimeException("User not foundiwth id" + userId));
    }
}
