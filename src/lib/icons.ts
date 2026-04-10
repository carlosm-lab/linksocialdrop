import {
  ArrowRight,
  AtSign,
  BarChart3,
  Bell,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Droplet,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Gamepad2,
  Ghost,
  Globe,
  Hash,
  HelpCircle,
  Home,
  Image,
  Inbox,
  KeyRound,
  LayoutGrid,
  Link,
  Link2,
  List,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  MousePointerClick,
  Music2,
  Paintbrush,
  Palette,
  Pencil,
  Pin,
  Play,
  Plus,
  Radio,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Tv,
  Type,
  Upload,
  User,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Master icon registry — maps string names (legacy Material Symbol names + new names)
 * to Lucide React components. One canonical source of truth.
 */
export const iconRegistry: Record<string, LucideIcon> = {
  // ─── Actions ───────────────────────────────────────────
  add: Plus,
  plus: Plus,
  add_link: Link2,
  link2: Link2,
  arrow_forward: ArrowRight,
  arrow_right: ArrowRight,
  check: Check,
  done: Check,
  check_circle: CheckCircle,
  copy: Copy,
  share: Share2,
  share2: Share2,
  external_link: ExternalLink,
  edit: Pencil,
  pencil: Pencil,
  trash: Trash2,
  trash2: Trash2,
  delete: Trash2,
  menu: Menu,
  close: X,
  x: X,

  // ─── Navigation ────────────────────────────────────────
  keyboard_arrow_up: ChevronUp,
  chevron_up: ChevronUp,
  expand_less: ChevronUp,
  keyboard_arrow_down: ChevronDown,
  chevron_down: ChevronDown,
  expand_more: ChevronDown,
  home: Home,

  // ─── UI / General ─────────────────────────────────────
  link: Link,
  lock: Lock,
  password: KeyRound,
  mail: Mail,
  email: Mail,
  person: User,
  user: User,
  name: User,
  group: Users,
  users: Users,
  settings: Settings,
  logout: LogOut,
  log_out: LogOut,
  search: Search,
  bell: Bell,
  grid_view: LayoutGrid,
  grid: LayoutGrid,
  list: List,
  image: Image,
  palette: Palette,
  type: Type,
  upload: Upload,
  visibility: Eye,
  eye: Eye,
  visibility_off: EyeOff,
  eye_off: EyeOff,
  inbox: Inbox,
  help_outline: HelpCircle,
  help: HelpCircle,
  subject: FileText,
  message: MessageSquare,

  // ─── Feature icons ────────────────────────────────────
  bolt: Zap,
  zap: Zap,
  brush: Paintbrush,
  paintbrush: Paintbrush,
  camera: Camera,
  shopping_bag: ShoppingBag,
  water_drop: Droplet,
  droplet: Droplet,
  support_agent: MessageCircle,
  headphones: MessageCircle,
  admin_panel_settings: Shield,
  shield: Shield,

  // ─── Analytics / Dashboard ─────────────────────────────
  leaderboard: BarChart3,
  bar_chart: BarChart3,
  analytics: TrendingUp,
  trending_up: TrendingUp,
  ads_click: MousePointerClick,
  mouse_pointer_click: MousePointerClick,

  // ─── Social Media (generic Lucide fallbacks — no brand icons) ──
  instagram: Camera,
  facebook: Globe,
  youtube: Play,
  twitter: AtSign,
  linkedin: Globe,
  twitch: Tv,
  github: Globe,
  tiktok: Music2,
  whatsapp: MessageCircle,
  telegram: Send,
  discord: Gamepad2,
  pinterest: Pin,
  snapchat: Ghost,
  messenger: MessageCircle,
  spotify: Radio,
  reddit: Hash,
  threads: AtSign,
};

/**
 * Resolves a string icon name to a Lucide component.
 * Falls back to the Link icon if not found.
 */
export function getIcon(name: string): LucideIcon {
  return iconRegistry[name.toLowerCase()] || Link;
}

/**
 * URL-to-icon patterns for automatic social media detection.
 * Order matters — first match wins.
 */
const URL_PATTERNS: { pattern: RegExp; icon: LucideIcon }[] = [
  { pattern: /instagram\.com/i, icon: Camera },
  { pattern: /facebook\.com/i, icon: Globe },
  { pattern: /youtube\.com|youtu\.be/i, icon: Play },
  { pattern: /twitter\.com|x\.com/i, icon: AtSign },
  { pattern: /tiktok\.com/i, icon: Music2 },
  { pattern: /linkedin\.com/i, icon: Globe },
  { pattern: /wa\.me|whatsapp\.com/i, icon: MessageCircle },
  { pattern: /t\.me|telegram\.org/i, icon: Send },
  { pattern: /discord\.com|discord\.gg/i, icon: Gamepad2 },
  { pattern: /twitch\.tv/i, icon: Tv },
  { pattern: /pinterest\.com/i, icon: Pin },
  { pattern: /snapchat\.com/i, icon: Ghost },
  { pattern: /messenger\.com|m\.me/i, icon: MessageCircle },
  { pattern: /github\.com/i, icon: Globe },
  { pattern: /spotify\.com/i, icon: Radio },
  { pattern: /reddit\.com/i, icon: Hash },
  { pattern: /threads\.net/i, icon: AtSign },
];

/**
 * Detects the social platform from a URL and returns the matching Lucide icon.
 * Falls back to ExternalLink if no pattern matches.
 *
 * @example
 * getIconByUrl("https://instagram.com/user") // → Camera icon
 * getIconByUrl("https://wa.me/123456")       // → MessageCircle icon
 * getIconByUrl("https://mysite.com")          // → ExternalLink icon
 */
export function getIconByUrl(url: string): LucideIcon {
  for (const { pattern, icon } of URL_PATTERNS) {
    if (pattern.test(url)) {
      return icon;
    }
  }
  return ExternalLink;
}

/**
 * Returns the string key for a URL-detected icon (useful for storing in DB).
 */
export function getIconNameByUrl(url: string): string {
  const urlLower = url.toLowerCase();
  if (urlLower.includes("instagram.com")) return "instagram";
  if (urlLower.includes("facebook.com")) return "facebook";
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be"))
    return "youtube";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com"))
    return "twitter";
  if (urlLower.includes("tiktok.com")) return "tiktok";
  if (urlLower.includes("linkedin.com")) return "linkedin";
  if (urlLower.includes("wa.me") || urlLower.includes("whatsapp.com"))
    return "whatsapp";
  if (urlLower.includes("t.me") || urlLower.includes("telegram.org"))
    return "telegram";
  if (urlLower.includes("discord.com") || urlLower.includes("discord.gg"))
    return "discord";
  if (urlLower.includes("twitch.tv")) return "twitch";
  if (urlLower.includes("pinterest.com")) return "pinterest";
  if (urlLower.includes("snapchat.com")) return "snapchat";
  if (urlLower.includes("messenger.com") || urlLower.includes("m.me"))
    return "messenger";
  if (urlLower.includes("github.com")) return "github";
  if (urlLower.includes("spotify.com")) return "spotify";
  if (urlLower.includes("reddit.com")) return "reddit";
  if (urlLower.includes("threads.net")) return "threads";
  return "link";
}
