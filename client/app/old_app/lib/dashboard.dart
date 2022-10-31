import 'package:flutter/material.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Dashboard",
      home: Theme(
        data: ThemeData(
          primarySwatch: Colors.blue,
          brightness: Brightness.dark,
        ),
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Dashboard'),
            leading: IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () {
                setState(() {

                });
              },
            ),
          ),
          resizeToAvoidBottomInset: false,
          body: const Center(
            child: Text('Dashboard'),
          ),
        ),
      ),
    );
  }
}