import 'package:flutter/material.dart';
import 'package:area/auth/login.dart';
import 'package:area/welcome_page.dart';
import 'package:area/dashboard.dart';
import 'package:area/auth/server.dart';
import 'package:area/auth/forgot_password.dart';

void main() {
  runApp(MaterialApp(
    routes: {
      '/server': (context) => const SelectServerPage(),
      '/login': (context) => const LoginPage(),
      '/welcome': (context) => const WelcomePage(),
      '/dashboard': (context) => const DashboardPage(),
      '/forgot_password': (context) => const ForgotPasswordPage(),
    },
    title: 'AREA',
    initialRoute: '/welcome',
  ));
}