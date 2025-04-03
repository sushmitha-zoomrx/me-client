<script>
    import Button from "@components/Button/Button.svelte";
    // import { validateEmail } from "@utils/validation";
    import { pushToast } from "@components/Toast/toasts";
    import { spinner } from "@components/Spinner/Spinner";
    import { previousUrl } from "@stores/auth.store";
    import { login } from "@models/user";
    import zrxLogo from "../../assets/svg/zoomrx_logo.png";

    // let useremail = "",
    //     isInvalidCredential = false;

    let loginHandle = async () => {
        // if (useremail === "" || !validateEmail(useremail)) {
        //     isInvalidCredential = true;
        //     return;
        // }
        try {
            spinner.showSpinner();
            await login(
                // {useremail}
            );
            // isInvalidCredential = false;
            redirectUser();
        } catch (error) {
            if (error === 401) {
                // isInvalidCredential = true;
                return;
            }
            pushToast("Something went wrong! Please try again later");
        } finally {
            spinner.hideSpinner();
        }
    };

    let redirectUser = () => {
        if ($previousUrl) {
            push($previousUrl);
            previousUrl.set("");
            return;
        }
        push("/chat");
    };
</script>

<img class="login__logo" src={zrxLogo} alt="ZoomRx Logo" />
<main class="login">
    <h1 style="font-weight: 700; font-size: 60px; align-items: center;">
        <span style="color: red;">Create</span> and
        <span style="color: red;">Optimize</span> your <br />marketing messages
        to HCPs
    </h1>
    <h3>
        Accelerate your message creation, optimization and deployment targeting
        HCPs <br />
        across channels using the power of GPT and ZoomRx Message Benchmarks
    </h3>
    <section class="login__container">
        <!-- <div class="alert" class:login__alert--hidden={!isInvalidCredential}>
            Invalid EmailID
        </div>
        <div>
            <div>
                <input
                    class="input login-input__input"
                    type="email"
                    bind:value={useremail}
                    placeholder="Your Official Email ID"
                />
            </div>
        </div> -->
        <div class="login__login-btn">
            <Button
                type="positive"
                className="btn__border-round"
                on:click={loginHandle}>TRY IT NOW!</Button
            >
        </div>
    </section>
    <div class="login__footer">
        I'm an early-stage prototype. Let's explore together. Be patient with my
        speed and learning curve!
    </div>
</main>

<style src="./style.scss"></style>
