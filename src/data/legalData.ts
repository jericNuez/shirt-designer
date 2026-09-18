export interface LegalSection {
  id: string;
  title: string;
  content: string[];
  subsections?: {
    subtitle: string;
    points: string[];
  }[];
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  lastUpdated: string;
  version: string;
  summary: string;
  sections: LegalSection[];
}

export const TERMS_OF_SERVICE_DATA: LegalDocument = {
  title: 'Terms of Service',
  subtitle: 'Please read these terms carefully before using 3D T-Shirt Customizer Studio.',
  lastUpdated: 'September 18, 2026',
  version: '1.4.2',
  summary:
    'By accessing and using 3D T-Shirt Customizer Studio, you agree to comply with and be bound by the following terms and conditions regarding user-uploaded content, software usage, and output files.',
  sections: [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: [
        'By accessing, browsing, or using the 3D T-Shirt Customizer Studio web application ("Service", "Application", or "Tool"), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service.',
        'If you do not agree with any part of these terms, you must discontinue the use of the Application immediately.',
      ],
    },
    {
      id: 'license-permitted-use',
      title: '2. License & Permitted Use',
      content: [
        '3D T-Shirt Customizer Studio is an open-source web application distributed under the MIT License.',
        'You are granted a worldwide, non-exclusive, royalty-free license to use the application to design apparel, render 3D garment mockups, and export layered graphics for personal or commercial printing purposes.',
      ],
      subsections: [
        {
          subtitle: 'Permitted Activities',
          points: [
            'Creating custom apparel artwork for personal use, merchandise, or client projects.',
            'Exporting layered Adobe Photoshop (.psd) files and PNG renders.',
            'Embedding or sharing rendered visual mockups on digital storefronts, portfolios, or social media.',
          ],
        },
      ],
    },
    {
      id: 'user-content-ip',
      title: '3. User Uploads & Intellectual Property',
      content: [
        'You retain all intellectual property rights and ownership to the images, logos, graphics, and text content that you upload into the application.',
        'The application processes all uploaded artwork locally within your web browser memory. Your artwork is not uploaded to our servers or stored in any central database.',
      ],
      subsections: [
        {
          subtitle: 'User Responsibility & Copyright Warranty',
          points: [
            'You warrant that you own or hold all required licenses, trademarks, and copyright authorizations for any graphics or logos you import into the designer.',
            'You agree not to upload materials that infringe upon third-party intellectual property, privacy rights, or applicable copyright laws.',
            '3D T-Shirt Customizer Studio and its maintainers assume no liability for copyright or trademark infringement arising from user-uploaded designs.',
          ],
        },
      ],
    },
    {
      id: 'output-disclaimer',
      title: '4. Output & Manufacturing Disclaimer',
      content: [
        'The 3D WebGL viewport and 2D canvas editor provide visual simulations intended for concept preview and layout arrangement.',
        'While exported layered PSD files are generated with 300 DPI canvas configurations, physical print results may vary based on garment fabric, print method (e.g., DTG, screen printing, sublimation), garment color absorption, and printer color profile calibration (CMYK conversions).',
        'All exported files, snapshots, and 3D mockups are provided "as-is" without warranty of exact color fidelity or physical print perfection.',
      ],
    },
    {
      id: 'limitation-liability',
      title: '5. Limitation of Liability',
      content: [
        'To the fullest extent permitted by law, in no event shall the author (Jeric Nuez) or contributors be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the application or any exported manufacturing assets.',
      ],
    },
    {
      id: 'modifications',
      title: '6. Changes to Terms',
      content: [
        'We reserve the right to modify or update these Terms of Service at any time. Changes will take effect immediately upon being posted within the application with an updated "Last Updated" timestamp.',
        'Continued use of the application following any modifications constitutes acceptance of the updated terms.',
      ],
    },
    {
      id: 'contact',
      title: '7. Contact & Support',
      content: [
        'If you have questions regarding these Terms of Service, you can reach out through our Feedback form in the application or directly on GitHub at github.com/jericnuez.',
      ],
    },
  ],
};

export const PRIVACY_POLICY_DATA: LegalDocument = {
  title: 'Privacy Policy',
  subtitle: 'Learn how your data and privacy are handled in 3D T-Shirt Customizer Studio.',
  lastUpdated: 'September 18, 2026',
  version: '1.4.2',
  summary:
    'We believe in total transparency and privacy-first design. 3D T-Shirt Customizer Studio operates primarily client-side: your designs and artwork never leave your browser.',
  sections: [
    {
      id: 'overview',
      title: '1. Privacy-First Philosophy',
      content: [
        '3D T-Shirt Customizer Studio is built as a client-side Single Page Application (SPA). Your 3D models, graphics, uploaded pictures, text layers, and garment color configurations are processed directly in your browser using WebGL and HTML5 Canvas technology.',
        'We do not operate backend servers that store, track, or analyze your design assets.',
      ],
    },
    {
      id: 'data-we-collect',
      title: '2. Information We Collect & How It Is Used',
      content: [
        'We only collect information when you explicitly interact with features that require transmission or local persistence.',
      ],
      subsections: [
        {
          subtitle: 'A. Local Storage (On Your Device)',
          points: [
            "Saved Projects: When you choose to save a project, your design data (layers, colors, fabric choices) is saved to your browser's local storage (`localStorage`). This data never leaves your device unless you manually export a project file.",
            "Local Feedback Cache: Backup copies of submitted feedback are retained in your browser's local storage.",
          ],
        },
        {
          subtitle: 'B. User Feedback Submissions (Optional)',
          points: [
            'Rating and Comments: Feedback topic, 1-5 star ratings, and textual comments you submit.',
            'Optional Email Address: If provided, used solely for developer follow-up regarding your bug report or feature inquiry.',
            'Device Screen Dimensions: Sent alongside feedback to assist in diagnosing mobile and responsive layout bugs.',
            'Destination: Feedback submissions are securely relayed directly to a developer Discord channel via Discord Webhooks.',
          ],
        },
      ],
    },
    {
      id: 'cookies-tracking',
      title: '3. Cookies & Tracking Technologies',
      content: [
        '3D T-Shirt Customizer Studio does NOT use third-party advertising cookies, marketing pixels, or invasive behavioral tracking beacons.',
        'Local storage is utilized strictly for essential application functionality (persisting your workspace state and project backups).',
      ],
    },
    {
      id: 'third-party-services',
      title: '4. Third-Party Integrations & External Links',
      content: ['The application may reference or link to reputable third-party services:'],
      subsections: [
        {
          subtitle: 'External Providers',
          points: [
            'Google Fonts: Web fonts loaded for typography customization in the 2D/3D studio.',
            'Discord (Webhooks): Used exclusively for delivering voluntary user feedback messages to the development team.',
            'GitHub & Buy Me a Coffee: External link destinations subject to their respective privacy policies.',
          ],
        },
      ],
    },
    {
      id: 'user-rights',
      title: '5. Data Retention & Your Rights',
      content: [
        'Because data is stored on your device, you have full control over your information at all times:',
      ],
      subsections: [
        {
          subtitle: 'Managing Your Data',
          points: [
            'Clearing Local Data: You can clear all saved projects and cached data at any time by clearing your browser cache/local storage.',
            'Feedback Removal: If you provided an email in a feedback submission and wish to have it deleted from our records, submit a removal request via our GitHub repository or feedback channel.',
          ],
        },
      ],
    },
    {
      id: 'children-privacy',
      title: "6. Children's Privacy",
      content: [
        'Our service is not directed to individuals under the age of 13. We do not knowingly collect personal identifiable information from children.',
      ],
    },
    {
      id: 'contact',
      title: '7. Contact Us',
      content: [
        'If you have any questions or suggestions regarding our Privacy Policy, please contact us via our GitHub profile (github.com/jericnuez) or by submitting a note through the in-app feedback dialog.',
      ],
    },
  ],
};
