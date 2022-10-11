import 'package:flutter/material.dart';
import 'package:requests/requests.dart';

class SelectServerPage extends StatefulWidget {
  const SelectServerPage({super.key});

  @override
  State<SelectServerPage> createState() => _SelectServerPageState();
}

mixin connectionServerData {
  static var serverController = TextEditingController();
  static var portController = TextEditingController();
}


class _SelectServerPageState extends State<SelectServerPage> {
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    connectionServerData.serverController.dispose();
    connectionServerData.portController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Server Connection',
      home: Theme(
        data: ThemeData(
          primarySwatch: Colors.blue,
          brightness: Brightness.dark,
        ),
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Select server'),
          ),
          resizeToAvoidBottomInset: false,
          body: Form(
            key: _formKey,
            child: Column(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: TextFormField(
                    controller: connectionServerData.serverController,
                    maxLength: 50,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.language),
                      labelText: 'Server IP',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a correct server IP';
                      }
                      if (value == 'localhost') {
                        return null;
                      }
                      if (!RegExp(
                              r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:https?://)?(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,6}$')
                          .hasMatch(value)) {
                        return 'Please enter a correct server IP';
                      }
                      return null;
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: TextFormField(
                    controller: connectionServerData.portController,
                    maxLength: 5,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.wifi_tethering),
                      labelText: 'Port',
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a port';
                      }
                      if (int.tryParse(value) == null ||
                          int.parse(value) < 1 ||
                          int.parse(value) > 65535 ||
                          value.contains('.')) {
                        return 'Please enter a valid port';
                      }
                      return null;
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(6.0),
                  child: TextButton.icon(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        ScaffoldMessenger.of(context).hideCurrentSnackBar();
                        Requests.get(
                                'http://${connectionServerData.serverController.text}:${connectionServerData.portController.text}/about.json')
                            .then((value) {
                          if (value.statusCode == 200) {
                            Navigator.pushNamed(context, '/login');
                          }
                        }).catchError((error) {
                          showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  backgroundColor: Colors.grey[900],
                                  title: const Text(
                                      'Server unreachable',
                                    style: TextStyle(
                                      color: Colors.white,
                                    ),
                                  ),
                                  content: const Text(
                                    'The server is unreachable. Please check your connection and try again.',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      style: TextButton.styleFrom(
                                        foregroundColor: Colors.white,
                                      ),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                      child: const Text('OK'),
                                    ),
                                  ],
                                );
                              });
                        });
                      }
                    },
                    label: const Text('Connect to server'),
                    icon: const Icon(Icons.computer),
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
