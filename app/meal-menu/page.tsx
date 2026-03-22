import { permanentRedirect } from "next/navigation";

/** Vecchia URL: reindirizza subito a Il mio menu. */
export default function MealMenuPage() {
  permanentRedirect("/my-menu");
}
