import 'package:flutter/material.dart';
import 'package:area/auth/login.dart';

class WelcomePage extends StatelessWidget {
  const WelcomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      routes: {
        '/login': (context) => const LoginPage(),
      },
      title: 'Welcome',
      home: Theme(
        data: ThemeData(
          primarySwatch: Colors.blue,
          brightness: Brightness.dark,
        ),
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Image.asset(
                  'resources/logo.png',
                  width: 200,
                  height: 200,
                ),
                const SizedBox(height: 30),
                const Text(
                  'Welcome to the AREA Project',
                  style: TextStyle(
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 30),
                Padding(
                  padding: const EdgeInsets.all(6.0),
                  child: TextButton.icon(
                    onPressed: () {
                      Navigator.pushNamed(context, '/server');
                    },
                    label: const Text('Get Started'),
                    icon: const Icon(Icons.thumb_up_off_alt_rounded),
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

