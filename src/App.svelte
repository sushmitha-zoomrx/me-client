<script>
	import Toast from "@components/Toast/Toast.svelte";
	import Spinner from "@components/Spinner/Spinner.svelte";
	import Router, {
		replace,
		push,
		location,
		querystring,
	} from "svelte-spa-router";
	import { routes } from "./routes/routes";
	import { email, previousUrl } from "@stores/auth.store";

	const UNAUTHORIZED_ROUTES = ["/user"];

	let conditionsFailed = (event) => {
		if (!$email) {
			$querystring && previousUrl.set($location + "?" + $querystring);
			push("/user");
			return;
		}
		if (event?.detail?.userData?.redirectTo) {
			replace(event.detail.userData.redirectTo);
		}
	};

	$: if (!$email) {
		if (!UNAUTHORIZED_ROUTES.includes($location)) {
			$querystring && previousUrl.set($location + "?" + $querystring);
			push("/user");
		}
	}

	$: if ($email) {
		if (UNAUTHORIZED_ROUTES.includes($location)) {
			push("/");
		}
	}
</script>

<Router {routes} on:conditionsFailed={conditionsFailed} />
<Toast />
<Spinner />
