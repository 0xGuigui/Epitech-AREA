import 'package:email_validator/email_validator.dart';
import 'package:flutter/material.dart';
import 'package:requests/requests.dart';
import 'server.dart';

//page who display the register form, need support navigation

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

mixin registerData {
  static var loginController = TextEditingController();
  static var passwordController = TextEditingController();
  static var passwordConfirmController = TextEditingController();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _loginController = TextEditingController();
  final _passwordController = TextEditingController();
  final _passwordConfirmController = TextEditingController();
  final _usernameController = TextEditingController();

  @override
  void dispose() {
    _loginController.dispose();
    _passwordController.dispose();
    _passwordConfirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Register',
      home: Theme(
        data: ThemeData(
          primarySwatch: Colors.blue,
          brightness: Brightness.dark,
        ),
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Register'),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ),
          resizeToAvoidBottomInset: false,
          body: Form(
            key: _formKey,
            child: Column(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: TextFormField(
                    controller: _loginController,
                    maxLength: 50,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.person),
                      labelText: 'Email as login',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter some text';
                      }
                      if (!EmailValidator.validate(value)) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                ),
                Padding(
                  //Username
                  padding: const EdgeInsets.all(15.0),
                  child: TextFormField(
                    controller: _usernameController,
                    maxLength: 50,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.person),
                      labelText: 'Username',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter some text';
                      }
                      return null;
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: TextFormField(
                    controller: _passwordController,
                    maxLength: 50,
                    obscureText: true,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.lock),
                      labelText: 'Password',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter some text';
                      }
                      if (value.length < 8) {
                        return 'Password must be at least 8 characters';
                      }
                      return null;
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: TextFormField(
                    controller: _passwordConfirmController,
                    maxLength: 50,
                    obscureText: true,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.lock),
                      labelText: 'Confirm Password',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter some text';
                      }
                      if (value.length < 8) {
                        return 'Password must be at least 8 characters';
                      }
                      if (value != _passwordController.text) {
                        return 'Password not match';
                      }
                      return null;
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(6.0),
                  child: TextButton.icon(
                    onPressed: () {
                      Requests.post(
                      'http://${connectionServerData.serverController.text}:${connectionServerData.portController.text}/register',
                      body: {
                          'username': _usernameController.text,
                          'email': _loginController.text,
                          'password': _passwordController.text,
                      },
                      bodyEncoding: RequestBodyEncoding.FormURLEncoded,
                      ).then((response) {
                        if (response.statusCode == 200) {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                              backgroundColor: Colors.grey[900],
                                title: const Text(
                              'Register',
                              style: TextStyle(
                                color: Colors.white,
                                ),
                              ),
                                content: const Text(
                                'Please check your email to validate your account, if you don\'t receive the email, please check your spam folder or your email is not valid',
                                style: TextStyle(
                                  color: Colors.white,
                                  ),
                                ),
                                actions: <Widget>[
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pushNamed(context, '/login');
                                      registerData.loginController = _loginController;
                                    },
                                    child: const Text(
                                      'OK',
                                      style: TextStyle(
                                        color: Colors.white,
                                        ),
                                      ),
                                  ),
                                ],
                              );
                            },
                          );
                        } else if (response.statusCode == 409) {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                              backgroundColor: Colors.grey[900],
                                title: const Text(
                              'Register',
                              style: TextStyle(
                                color: Colors.white,
                                ),
                              ),
                                content: const Text(
                                'This email or username is already used',
                                style: TextStyle(
                                  color: Colors.white,
                                  ),
                                ),
                                actions: <Widget>[
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                      _loginController.clear();
                                      _passwordController.clear();
                                      _passwordConfirmController.clear();
                                      _usernameController.clear();
                                    },
                                    child: const Text(
                                      'OK',
                                      style: TextStyle(
                                        color: Colors.white,
                                        ),
                                      ),
                                  ),
                                ],
                              );
                            },
                          );
                        } else {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return AlertDialog(
                              backgroundColor: Colors.grey[900],
                                title: const Text(
                              'Register',
                              style: TextStyle(
                                color: Colors.white,
                                ),
                              ),
                                content: const Text(
                                'An error occurred, please try again later',
                                style: TextStyle(
                                  color: Colors.white,
                                  ),
                                ),
                                actions: <Widget>[
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                    },
                                    child: const Text(
                                      'OK',
                                      style: TextStyle(
                                        color: Colors.white,
                                        ),
                                      ),
                                  ),
                                ],
                              );
                            },
                          );
                        }
                      });
                    },
                    label: const Text('Register'),
                    icon: const Icon(Icons.login),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Colors.blue,
                      disabledForegroundColor: Colors.grey.withOpacity(0.38),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}