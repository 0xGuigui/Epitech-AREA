import 'package:email_validator/email_validator.dart';
import 'package:flutter/material.dart';
import 'register.dart';
import 'package:requests/requests.dart';
import 'server.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _loginController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _loginController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Login',
      home: Theme(
        data: ThemeData(
          primarySwatch: Colors.blue,
          brightness: Brightness.dark,
        ),
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Login'),
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
                      labelText: 'Login',
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
                        return 'Please enter password';
                      }
                      return null;
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(6.0),
                  //change color of text button
                  child: TextButton.icon(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        Requests.post(
                          'http://${connectionServerData.serverController.text}:${connectionServerData.portController.text}/login',
                          body: {
                            'email': _loginController.text,
                            'password': _passwordController.text,
                          },
                        ).then((response) {
                          if (response.statusCode == 200) {
                            Navigator.pushNamed(context, '/dashboard');
                          } else {
                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  backgroundColor: Colors.grey[900],
                                  title: const Text(
                                      'Error',
                                      style: TextStyle(
                                        color: Colors.white,
                                      ),
                                  ),
                                  content: const Text(
                                      'Wrong login or password',
                                    style: TextStyle(
                                      color: Colors.white,
                                    ),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      style: TextButton.styleFrom(
                                        foregroundColor: Colors.white,
                                      ),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                        _passwordController.clear();
                                      },
                                      child: const Text('OK'),
                                    ),
                                  ],
                                );
                              },
                            );
                          }
                        });
                      }
                    },
                    label: const Text('Login'),
                    icon: const Icon(Icons.login),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Colors.blue,
                      disabledForegroundColor: Colors.grey.withOpacity(0.38),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(6.0),
                  child: TextButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const RegisterPage(),
                        ),
                      );
                      _loginController.clear();
                      _passwordController.clear();
                    },
                    label: const Text('Register'),
                    icon: const Icon(Icons.add),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.white,
                      backgroundColor: Colors.blue,
                      disabledForegroundColor: Colors.grey.withOpacity(0.38),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(6.0),
                  child: TextButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/forgot_password');
                    },
                    label: const Text('Forgot password'),
                    icon: const Icon(Icons.help),
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