<script>
  import { Router, Link, Route } from "svelte-routing";
  import Login from "./lib/login_page.svelte";
  import SignUp from "./lib/sign-up_page.svelte";

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
  </div>
</Router>