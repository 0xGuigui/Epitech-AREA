<script>
  import { Router, Link, Route } from "svelte-routing";
  import Login from "./lib/login_page.svelte";
  import SignUp from "./lib/sign-up_page.svelte";
  import Home from "./lib/main_page.svelte";
  import Test from "./lib/test.svelte";

  export let url = "";
</script>

<Router url="{url}">
  <div>
    <Route path="/">
      <h1>Welcome to AREA</h1>
      <Link to="login">Login</Link>
      <Link to="signup">/ Sign-up</Link>
    </Route>
    <Route path="/login" component="{Login}" />
    <Route path="/signup" component="{SignUp}" />
    <Route path="/main_page" component="{Home}"/>
    <Route path="/test" component="{Test}"/>
  </div>
</Router>