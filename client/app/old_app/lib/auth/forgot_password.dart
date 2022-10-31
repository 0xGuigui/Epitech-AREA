import 'package:flutter/material.dart';
import 'package:email_validator/email_validator.dart';
import 'package:requests/requests.dart';
import 'server.dart';

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Forgot Password',
      home: Theme(
          data: ThemeData(
            primarySwatch: Colors.blue,
            brightness: Brightness.dark,
          ),
          child: Scaffold(
            appBar: AppBar(
              title: const Text('Forgot password'),
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
                      controller: _emailController,
                      maxLength: 50,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.email),
                        labelText: 'Email',
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
                    padding: const EdgeInsets.all(6.0),
                    child: TextButton.icon(
                      onPressed: () {
                        Requests.post(
                        'http://${connectionServerData.serverController.text}:${connectionServerData.portController.text}/reset-password',
                        body: {
                          'email': _emailController.text,
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
                                    'Success',
                                    style: TextStyle(
                                      color: Colors.white,
                                    ),
                                  ),
                                  content: const Text(
                                    'If the email is valid, you will receive an email with a link to reset your password.',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      style: TextButton.styleFrom(
                                        foregroundColor: Colors.white,
                                      ),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                        _emailController.clear();
                                      },
                                      child: const Text('OK'),
                                    ),
                                  ],
                                );
                              });
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
                                    'An error occurred while trying to reset your password.',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      style: TextButton.styleFrom(
                                        foregroundColor: Colors.white,
                                      ),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                        _emailController.clear();
                                      },
                                      child: const Text('OK'),
                                    ),
                                  ],
                                );
                              });
                          }
                        });
                      },
                      label: const Text('Submit'),
                      icon: const Icon(Icons.send),
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
          )),
    );
  }
}