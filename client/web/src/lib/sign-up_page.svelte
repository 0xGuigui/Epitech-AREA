<script>
    import { useForm, Hint, HintGroup, validators, required, minLength, email } from "svelte-use-form";

    const form = useForm();

    const requiredMessage = "This field is required";
    (async () => {
        const response = await fetch(`http://localhost:8080/about.json`);
        const data = await response.json();
        console.log(data);
    })();
</script>

<main>
    <form use:form style="display: flex; flex-direction: column">
        <h1>
            Registration
        </h1>
        <label for="email">Email</label>
        <input type="email" name="email" use:validators={[required, email]}/>
        <HintGroup for="email">
            <Hint on="required">{requiredMessage}</Hint>
            <Hint on="email" hideWhenRequired>This must be a valid email</Hint>
        </HintGroup>

        <label for="name">Name</label>
        <input type="text" name="name"/>

        <label for="password">Password</label>
        <input type="password" name="password" use:validators={[required, minLength(5), containNumbers(2)]}/>
        <HintGroup for="password">
            <Hint on="required">{requiredMessage}</Hint>
            <Hint on="minLength" hideWhenRequired let:value>This field must have at least {value} characters.</Hint>
            <Hint on="containNumbers" hideWhen="minLength" let:value>
                This field must contain at least {value} numbers.
            </Hint>
        </HintGroup>

        <label for="passwordConfirmation">Password Confirmation</label>
        <input type="password" name="passwordConfirmation" use:validators={[required, passwordMatch]}/>
        <HintGroup for="passwordConfirmation">
            <Hint on="required">{requiredMessage}</Hint>
            <Hint on="passwordMatch" hideWhenRequired>Passwords do not match</Hint>
        </HintGroup><br />

        <button on:click={(e) => {
        e.preventDefault();
        console.log(mail);
        console.log(password);
       }} disabled={!$form.valid} on:click|preventDefault>Submit</button>
    </form>
</main>

<style>
    :global(.touched:invalid) {
        border-color: red;
        outline-color: red;
    }
    main {
        display: flex;
        justify-content: space-around;
    }
    pre {
        height: 80vh;
        overflow: auto;
        font-size: 12px;
    }
</style>