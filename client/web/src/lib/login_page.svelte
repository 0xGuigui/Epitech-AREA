<script>
    import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";

    const form = useForm();
    let mail = '';
    let password = '';

    (async () => {
        const response = await fetch(`http://localhost:8080/about.json`);
        const data = await response.json();
        console.log(data);
    })();
</script>

<form use:form style="display: flex; flex-direction: column">
    <h1>Login</h1>

    <HintGroup for="email">
        <Hint on="required">Mandatory field</Hint>
        <Hint on="email" hideWhenRequired>Email is not valid</Hint>
    </HintGroup>
    <input bind:value={mail} type="email" name="email" placeholder="enter your email" style="margin-bottom: 8px" use:validators={[required, email]} />
    <Hint for="password" on="required">Mandatory field</Hint>
    <input bind:value={password} type="password" name="password" placeholder="enter your password" style="margin-bottom: 8px" use:validators={[required]} />

    <button on:click={(e) => {
    e.preventDefault();
    console.log(mail);
    console.log(password);
  }} disabled={!$form.valid}>Login</button>
</form>

<style>
    :global(.touched:invalid) {
        border-color: red;
        outline-color: red;
    }
</style>