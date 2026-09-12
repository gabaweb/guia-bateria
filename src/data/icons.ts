// Settings destinations share their symbol and background throughout the guide.
// Rendered with Framework7 Icon. Most symbols use its local icon font; the
// accessibility pictogram is a local asset because that font has no equivalent.
export const settingsIcons = {
  general: { f7: "gear_alt_fill", bgColor: "gray" },
  battery: { f7: "battery_100", bgColor: "green" },
  display: { f7: "sun_max_fill", bgColor: "blue" },
  accessibility: { icon: "icon-accessibility", bgColor: "blue" },
  apps: { f7: "square_grid_2x2_fill", bgColor: "blue" },
  siri: { f7: "waveform_circle", bgColor: "purple" },
  privacy: { f7: "hand_raised_fill", bgColor: "blue" },
  notifications: { f7: "bell_fill", bgColor: "red" },
  sounds: { f7: "speaker_3_fill", bgColor: "pink" },
  mail: { f7: "envelope_fill", bgColor: "blue" },
  cellular: { f7: "antenna_radiowaves_left_right", bgColor: "green" },
  phone: { f7: "phone_fill", bgColor: "green" },
  hotspot: { f7: "personalhotspot", bgColor: "green" },
  wifi: { f7: "wifi", bgColor: "blue" },
  airplane: { f7: "airplane", bgColor: "orange" },
  device: { f7: "device_phone_portrait", bgColor: "gray" },
} as const;

export type SettingsIcon = keyof typeof settingsIcons;

// Shared status symbols keep list rows and detail pages consistent.
export const tipStatusIndicators = {
  completed: {
    label: "Concluída",
    f7: "checkmark_alt_circle_fill",
    color: "green",
  },
  later: { label: "Para depois", f7: "clock_fill", color: "orange" },
} as const;
