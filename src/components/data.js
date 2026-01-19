import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
  EyeIcon,
  ShieldCheckIcon,
  ArrowLeftEndOnRectangleIcon,
  PlusIcon,
  CogIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.webp";
import benefitTwoImg from "../../public/img/benefit-two.webp";
import { FlagIcon } from "@heroicons/react/20/solid";

const benefitOne = {
  title: "Φυσικό αποτέλεσμα με εξατομίκευση",
  desc: "Δεν υπάρχει “μία λύση για όλους”. Μελετάμε αναλογίες, στόχους και ιατρικό ιστορικό πριν προτείνουμε το πλάνο.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Κατανόηση αναγκών",
      desc: "Συζητάμε τι θέλετε να αλλάξει και τι δεν θέλετε να αλλάξει.",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Ρεαλιστικές επιλογές",
      desc: "Ξεκάθαρη ενημέρωση για τι μπορεί να επιτευχθεί.",
      icon: <EyeIcon />,
    },
    {
      title: "Σχεδιασμός βήμα-βήμα",
      desc: "Πλάνο επέμβασης/θεραπείας και αποθεραπείας.",
      icon: <AdjustmentsHorizontalIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Περισσότερα από μία επέμβαση — μια ολοκληρωμένη εμπειρία φροντίδας",
  desc: "Η διαδικασία δεν τελειώνει στο χειρουργείο. Είμαστε δίπλα σας πριν, κατά τη διάρκεια και μετά.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Ασφάλεια & πρωτόκολλα",
      desc: "Ιατρικά πρωτόκολλα, σωστή προετοιμασία και παρακολούθηση.",
      icon: <ShieldCheckIcon />,
    },
    {
      title: "Μετά την επέμβαση",
      desc: "Οδηγίες, follow-ups, και ξεκάθαρη επικοινωνία για κάθε στάδιο.",
      icon: <PlusIcon />,
    },
    {
      title: "Διαφανές πλάνο κόστους",
      desc: "Αναλυτική ενημέρωση για τι περιλαμβάνεται και ποια είναι τα επόμενα βήματα. ",
      icon: <FlagIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
