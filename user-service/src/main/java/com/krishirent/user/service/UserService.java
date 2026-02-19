package com.krishirent.user.service;

import com.krishirent.user.dto.*;

import java.util.List;

public interface UserService {

    UserResponse register(UserRegisterRequest request);

    UserResponse login(UserLoginRequest request);

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    List<UserResponse> getAllUsers();

    long getUserCount();
}
