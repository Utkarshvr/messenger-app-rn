import { Redirect } from "expo-router";

export default function RedirectingPage() {
  return <Redirect href={"/home"} />;
}
