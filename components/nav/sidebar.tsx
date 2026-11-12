const navigation = [
  // Élève
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['student', 'parent', 'tutor', 'school_admin'] },
  { name: 'Session', href: '/session', icon: Target, roles: ['student'] },
  { name: 'Contrôles', href: '/onboarding', icon: Calendar, roles: ['student'] },
  
  // Parent
  { name: 'Rapports', href: '/reports', icon: FileText, roles: ['parent', 'school_admin'] },
  
  // Tuteur
  { name: 'Alertes', href: '/tutor', icon: ShieldAlert, roles: ['tutor', 'school_admin'] },
  { name: 'Mes Élèves', href: '/tutor/students', icon: Users, roles: ['tutor', 'school_admin'] },
  
  // Admin
  { name: 'Import Items', href: '/admin/items', icon: Upload, roles: ['school_admin'] },
];