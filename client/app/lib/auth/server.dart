import 'package:flutter/material.dart';
import 'package:requests/requests.dart';

class SelectServerPage extends StatefulWidget {
  const SelectServerPage({super.key});

  @override
  State<SelectServerPage> createState() => _SelectServerPageState();
}

class _SelectServerPageState extends State<SelectServerPage> {
  final _formKey = GlobalKey<FormState>();
  final _serverController = TextEditingController();
  final _portController = TextEditingController();

  @override
  void dispose() {
    _serverController.dispose();
    _portController.dispose();
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
                    controller: _serverController,
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
                    controller: _portController,
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
                                'http://${_serverController.text}:${_portController.text}')
                            .then((value) {
                          if (value.statusCode == 401) {
                            Navigator.pushNamed(context, '/login');
                            print(context);
                          } else if (value.statusCode == 0) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Host lookup failed'),
                              ),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Server not found'),
                              ),
                            );
                          }
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
                Padding(
                  padding: const EdgeInsets.all(6.0),
                  child: TextButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/login');
                    },
                    label: const Text('Bypass server connection'),
                    icon: const Icon(Icons.accessibility),
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
