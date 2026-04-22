import { TestTube, Eye, Code, BarChart3, Accessibility, Cpu } from "lucide-react";
import { primary, success, warning } from "@/shared/styles/colors";

export const testTypeConfig = [
  { icon: TestTube, color: primary, bg: "#EEF2FF" },
  { icon: Eye, color: "#7048E8", bg: "#F3F0FF" },
  { icon: Code, color: success, bg: "#EBFBEE" },
  { icon: BarChart3, color: warning, bg: "#FFF9DB" },
  { icon: Accessibility, color: "#E64980", bg: "#FFF0F6" },
  { icon: Cpu, color: "#0C8599", bg: "#E3FAFC" },
];