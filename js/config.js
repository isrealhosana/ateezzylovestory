/* ==========================================================================
   EDIT THIS FILE to change anything on the site: names, date, story, photos,
   venue, bank details, Supabase keys. No other file needs touching.
   Photos live in /assets/img — each has a "-sm" (640px) and "-lg" (1500px)
   version. To add a photo: drop in two files named  my-photo-sm.webp and
   my-photo-lg.webp, then add one line to PHOTOS below.
   ========================================================================== */

window.WEDDING = {
  /* ---------- Couple & date ---------- */
  groom: "Isreal",
  bride: "Etieno",
  dateISO: "2026-12-24T14:00:00+01:00", // Nigeria is UTC+1
  timeLabel: "2:00 PM",
  introLine: "Some love stories begin with Jenga. Ours leads to forever.",

  /* ---------- Envelope & invitation card ---------- */
  envelope: {
    hint: "You've got a letter",
    tap: "Tap to open",
    cardLines: ["request the pleasure of your company", "at their wedding"],
  },

  /* ---------- Venue ---------- */
  venue: {
    name: "Jubilee Garden",
    addressLines: ["Osongama Estate", "Uyo, Akwa Ibom State"],
    dressCode: "", // e.g. "Burgundy, blush & beige" — leave "" to hide this row
    note: "", // e.g. "Reception to follow" — leave "" to hide
    // Paste your exact Google Maps share link here if you have one (recommended).
    // Otherwise the site builds a directions link from the venue name below.
    mapsUrl: "",
    mapsQuery: "Jubilee Garden, Osongama Estate, Uyo, Akwa Ibom, Nigeria",
  },

  /* ---------- Photos (width, height) ---------- */
  photos: {
    "engaged-arch": { w: 1500, h: 2250, alt: "Isreal and Etieno smiling, her ring raised, in front of a floral arch" },
    "engaged-close": { w: 1500, h: 2250, alt: "Isreal and Etieno showing off the engagement ring" },
    "proposal-neon": { w: 1500, h: 2250, alt: "Isreal on one knee beneath a glowing 'Will you marry me?' sign" },
    "proposal-arch": { w: 1500, h: 2250, alt: "Isreal kneeling and holding Etieno's hand in front of the floral heart" },
    "proposal-petals-1": { w: 1500, h: 2250, alt: "The proposal on a floor of rose petals" },
    "proposal-petals-2": { w: 1500, h: 2250, alt: "Isreal proposing among rose petals and candles" },
    "proposal-ring": { w: 1500, h: 2250, alt: "Etieno laughing as the ring goes on" },
    "kiss": { w: 1500, h: 2250, alt: "Isreal and Etieno sharing a kiss" },
    "together": { w: 1500, h: 2250, alt: "Isreal and Etieno holding hands, smiling at each other" },
    "hands-plane": { w: 1242, h: 2208, alt: "Their hands held together" },
    "embrace-bw": { w: 960, h: 1280, alt: "Etieno embracing Isreal, black and white" },
    "beach-bw": { w: 1500, h: 2000, alt: "The two of them embracing on a beach, black and white" },
    "portrait-bw-seated": { w: 1500, h: 2249, alt: "Isreal standing behind a seated Etieno, black and white studio portrait" },
    "portrait-bw-hands": { w: 1500, h: 2250, alt: "Isreal's hands resting on Etieno's shoulders, black and white" },
    "portrait-bw-shoulder": { w: 1500, h: 2250, alt: "Isreal and Etieno, his hand on her shoulder, black and white" },
    "portrait-bw-embrace": { w: 1500, h: 2249, alt: "Isreal and Etieno embracing, black and white" },
    "portrait-studio-smile": { w: 1500, h: 2249, alt: "Isreal and Etieno smiling in matching black" },
    "portrait-studio-close": { w: 1500, h: 2249, alt: "Isreal and Etieno in a close studio portrait" },
    "garden-smile": { w: 1500, h: 2249, alt: "Etieno smiling behind Isreal in a sunlit garden" },
    "garden-dance": { w: 1500, h: 2249, alt: "Isreal and Etieno dancing in the garden" },
    "garden-walk": { w: 1500, h: 2249, alt: "Isreal and Etieno walking hand in hand through the garden" },
    "garden-light": { w: 1500, h: 2249, alt: "Isreal and Etieno standing in dappled light" },
    "garden-forehead": { w: 1500, h: 2249, alt: "Isreal and Etieno forehead to forehead" },
    "etieno": { w: 1500, h: 2000, alt: "Etieno" },
  },

  heroPhoto: "garden-smile",

  /* ---------- Our Story (chapters) ----------
     photo: one key from PHOTOS above, an array of keys, or "" for no photo.
     big:   a large typographic line (used for dates).                        */
  storyIntro:
    "Some love stories begin with grand gestures, perfectly planned dates, or magical moments. Ours? It began with Jenga, a bottle of Agor wine, a little competition, and a visit that neither of us knew would become the beginning of forever.",
  story: [
    {
      kicker: "Chapter one",
      title: "A game of Jenga",
      big: "1 August 2025",
      text: [
        "That was the very first time you came to my house. We played Jenga, shared Agor wine, laughed, and somehow, you kept winning over and over again.",
        "To this day, I can confidently argue that I let you win because, well, you were cute. 😂",
      ],
      photo: "etieno",
    },
    {
      kicker: "Chapter two",
      title: "Something happened",
      text: [
        "Somewhere between the games, the laughter, and our conversations, something happened. I remember looking at you and realizing just how much I enjoyed having you around. I liked your company, I liked your energy, and I knew there was something about you that I wanted to explore.",
        "I remember telling you that I liked you, and we eventually agreed to give this a try.",
        "I was so excited that I immediately called Precious to share the news. I don't think I could have kept it to myself even if I tried.",
      ],
      photo: "hands-plane",
    },
    {
      kicker: "Chapter three",
      title: "Something bigger",
      text: [
        "What started as a simple visit gradually became something much bigger. A connection, a friendship, a partnership, and eventually, a love that neither of us wants to imagine life without.",
        "Looking back, it's beautiful how something as ordinary as a game of Jenga could become such an unforgettable part of our story.",
      ],
      photo: "embrace-bw",
    },
    {
      kicker: "Chapter four",
      title: "Will you marry me?",
      text: [], // add your proposal story here when you're ready, e.g. ["It was ..."]
      photo: ["proposal-neon", "proposal-petals-1"],
    },
    {
      kicker: "Chapter five",
      title: "Forever",
      text: [
        "We didn't know that evening that we'd be here, planning a wedding, choosing colours, putting together invitations, and preparing to celebrate a lifetime together.",
        "But here we are.",
        "From that first game of Jenga to forever, from giving it a try to choosing each other for a lifetime. Now, we're writing our favourite chapter yet.",
      ],
      photo: "kiss",
      closing: "Our forever begins on 24th December 2026.",
    },
  ],

  /* ---------- Gallery ----------
     Four "plates", each a title + rows of photos. `span` is the width of a
     photo in a row of 6 on desktop (2 = narrow, 3 = half, 4 = wide). Keep each
     row adding up to 6. On phones, wide photos (4+) go full width and the
     rest sit two to a row. Reorder or swap any key from PHOTOS above.        */
  gallery: [
    {
      title: "Portraits", sub: "In black, white & colour",
      rows: [
        [{ k: "portrait-bw-shoulder", span: 2 }, { k: "portrait-bw-seated", span: 4 }],
        [{ k: "portrait-bw-embrace", span: 4 }, { k: "portrait-bw-hands", span: 2 }],
        [{ k: "portrait-studio-smile", span: 3 }, { k: "portrait-studio-close", span: 3 }],
      ],
    },
    {
      title: "In the Garden", sub: "Cream, green & golden light",
      rows: [
        [{ k: "garden-smile", span: 4 }, { k: "garden-forehead", span: 2 }],
        [{ k: "garden-light", span: 2 }, { k: "garden-dance", span: 2 }, { k: "garden-walk", span: 2 }],
      ],
    },
    {
      title: "The Question", sub: "Will you marry me?",
      rows: [
        [{ k: "proposal-petals-1", span: 4 }, { k: "proposal-ring", span: 2 }],
        [{ k: "kiss", span: 2 }, { k: "engaged-close", span: 2 }, { k: "proposal-neon", span: 2 }],
      ],
    },
    {
      title: "Along the Way", sub: "The quiet in-betweens",
      rows: [
        [{ k: "etieno", span: 2 }, { k: "hands-plane", span: 2 }, { k: "beach-bw", span: 2 }],
      ],
    },
  ],

  /* ---------- RSVP ---------- */
  rsvp: {
    maxGuests: 5, // max number a guest can select
    deadline: "", // e.g. "30 November 2026" — leave "" to hide
  },

  /* ---------- Gifts (leave a field "" to hide it) ---------- */
  gifts: {
    intro:
      "Your presence is the greatest gift. Should you wish to bless us further, you may do so by transfer.",
    ngn: {
      title: "Nigerian Naira",
      code: "NGN",
      bank: "Wema Bank",
      accountName: "Etieno Usoroh",
      accountNumber: "0419911973",
    },
    usd: {
      title: "US Dollar",
      code: "USD",
      bank: "Lead Bank",
      accountName: "Isreal Hosana",
      accountNumber: "217665623787",
      routingNumber: "", // ← add the ACH/ABA routing number here (shown if filled)
      swift: "", // ← add SWIFT/BIC here for international transfers (shown if filled)
    },
  },

  /* ---------- Backend (Supabase) — see README.md ----------
     Leave blank until you've created your project. While blank, the RSVP and
     Wishes forms will tell the visitor they aren't connected — they will
     never pretend to save.                                                   */
  supabase: {
    url: "https://nkxgkjbweqryhzgkyocw.supabase.co",
    anonKey: "sb_publishable_VKOUyAlu5v9hdB2CVmkmig_eF4039HA", // public key — safe to expose; row-level security protects data
  },

  /* ---------- SEO / sharing ---------- */
  siteUrl: "https://ateezzylovestory.com",
};
