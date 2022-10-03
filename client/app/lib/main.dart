import 'package:flutter/material.dart';
import 'auth/login.dart';
import 'package:area/welcome_page.dart';

void main() {
  runApp(MaterialApp(
    routes: {
      '/login': (context) => const loginPage(),
      '/welcome': (context) => const welcomePage(),
    },
    title: 'AREA',
    initialRoute: '/welcome',
  ));
}