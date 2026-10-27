import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Easing,
} from 'react-native';

interface User {
  name: string;
  email: string;
}

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  time: string;
  amount: string;
  type: 'incoming' | 'outgoing';
}

interface QuickAction {
  id: DemoScreen;
  label: string;
  iconText: string;
}

type DemoScreen = 'analytics' | 'transactions' | 'budget' | 'settings';
type AppScreen = 'login' | 'signup' | 'home' | DemoScreen;

interface BudgetCategory {
  id: 'food' | 'travel' | 'shopping' | 'subscriptions';
  name: string;
  spent: number;
  limit: number;
  color: string;
}

type TransactionFilter = 'all' | 'incoming' | 'outgoing';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const screenTransition = useRef(new Animated.Value(1)).current;
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Logout confirmation modal (works seamlessly on iOS/Android and custom Appium automation)
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Notification toggle in settings screen demo
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'Month' | 'Quarter'>('Month');
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>('all');
  const [budgetLimits, setBudgetLimits] = useState({
    food: 1200,
    travel: 900,
    shopping: 700,
    subscriptions: 300,
  });

  // Registered users map (seeded with demo user)
  const [users, setUsers] = useState<Record<string, { name: string; password: string }>>({
    'saketh.aryan@test.com': {
      name: 'Saketh Aryan',
      password: 'Test@123',
    },
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  useEffect(() => {
    screenTransition.setValue(0);
    const animation = Animated.timing(screenTransition, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [currentScreen, screenTransition]);

  // Demo Activities
  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      title: 'Cloud Services Subscription',
      category: 'Infrastructure',
      time: 'Today, 2:45 PM',
      amount: '-$49.99',
      type: 'outgoing',
    },
    {
      id: '2',
      title: 'Client Payment Received',
      category: 'Consulting',
      time: 'Yesterday',
      amount: '+$1,250.00',
      type: 'incoming',
    },
    {
      id: '3',
      title: 'UI Design Kit Pro',
      category: 'Tools',
      time: 'Oct 24',
      amount: '-$89.00',
      type: 'outgoing',
    },
  ];

  const quickActions: QuickAction[] = [
    { id: 'analytics', label: 'Analytics', iconText: '📊' },
    { id: 'transactions', label: 'Transactions', iconText: '🧾' },
    { id: 'budget', label: 'Budget', iconText: '🎯' },
    { id: 'settings', label: 'Settings', iconText: '⚙️' },
  ];

  const budgetCategories: BudgetCategory[] = [
    { id: 'food', name: 'Food & Dining', spent: 840, limit: budgetLimits.food, color: '#f97316' },
    { id: 'travel', name: 'Travel', spent: 560, limit: budgetLimits.travel, color: '#0ea5e9' },
    { id: 'shopping', name: 'Shopping', spent: 430, limit: budgetLimits.shopping, color: '#8b5cf6' },
    {
      id: 'subscriptions',
      name: 'Subscriptions',
      spent: 120,
      limit: budgetLimits.subscriptions,
      color: '#10b981',
    },
  ];

  const filteredTransactions = recentActivities.filter(
    (item) => transactionFilter === 'all' || item.type === transactionFilter,
  );

  const handleLogin = () => {
    setLoginError('');
    const trimmedEmail = loginEmail.trim().toLowerCase();

    if (!trimmedEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const existingUser = users[trimmedEmail];
    if (!existingUser || existingUser.password !== loginPassword) {
      setLoginError('Invalid email or password.');
      return;
    }

    setCurrentUser({
      name: existingUser.name,
      email: trimmedEmail,
    });
    setLoginEmail('');
    setLoginPassword('');
    setCurrentScreen('home');
  };

  const handleSignup = () => {
    setSignupError('');
    const trimmedName = signupName.trim();
    const trimmedEmail = signupEmail.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !signupPassword) {
      setSignupError('Please fill in all fields.');
      return;
    }

    if (users[trimmedEmail]) {
      setSignupError('An account with this email already exists.');
      return;
    }

    // Save user
    setUsers((prev) => ({
      ...prev,
      [trimmedEmail]: {
        name: trimmedName,
        password: signupPassword,
      },
    }));

    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setLoginEmail(trimmedEmail);
    setLoginPassword('');
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const confirmLogoutAction = () => {
    setShowLogoutModal(false);
    setCurrentUser(null);
    setCurrentScreen('login');
    setLoginError('');
    setSignupError('');
  };

  const promptLogout = () => {
    // Show in-app confirmation modal (works consistently across all platforms and automated test frameworks)
    setShowLogoutModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.screenTransition,
            {
              opacity: screenTransition,
              transform: [
                {
                  translateY: screenTransition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
        {/* ===================== LOGIN SCREEN ===================== */}
        {currentScreen === 'login' && (
          <ScrollView
            contentContainerStyle={styles.authScrollContent}
            keyboardShouldPersistTaps="handled"
            accessible={false}
            testID="login-screen"
            accessibilityLabel="login-screen"
          >
            <View style={styles.authHeader}>
              <View style={styles.appLogoBadge}>
                <Text style={styles.appLogoText}>A</Text>
              </View>
              <Text
                style={styles.mainTitle}
                testID="login-title"
                accessibilityLabel="login-title"
              >
                Welcome to Artha
              </Text>
              <Text style={styles.mainSubtitle}>Your money, clearly in view.</Text>
            </View>

            <View style={styles.authCard}>
              {!!loginError && (
                <View
                  style={styles.errorContainer}
                  testID="login-error-container"
                  accessibilityLabel="login-error-container"
                >
                  <Text
                    style={styles.errorText}
                    testID="login-error-text"
                  >
                    {loginError}
                  </Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  editable={true}
                  placeholder="name@example.com"
                  placeholderTextColor="#94a3b8"
                  value={loginEmail}
                  onChangeText={(value) => {
                    setLoginEmail(value);
                    if (loginError) setLoginError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  testID="login-email-input"
                  accessibilityLabel="login-email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  editable={true}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={loginPassword}
                  onChangeText={(value) => {
                    setLoginPassword(value);
                    if (loginError) setLoginError('');
                  }}
                  secureTextEntry
                  textContentType="oneTimeCode"
                  autoComplete="off"
                  testID="login-password-input"
                  accessibilityLabel="login-password-input"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryAuthButton}
                onPress={handleLogin}
                testID="login-submit-button"
                accessibilityLabel="login-submit-button"
                activeOpacity={0.85}
              >
                <Text style={styles.primaryAuthButtonText}>Sign In</Text>
              </TouchableOpacity>

              <View style={styles.authFooterRow}>
                <Text style={styles.footerPromptText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setLoginError('');
                    setCurrentScreen('signup');
                  }}
                  testID="goto-signup-button"
                  accessibilityLabel="goto-signup-button"
                >
                  <Text style={styles.footerLinkText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* ===================== SIGNUP SCREEN ===================== */}
        {currentScreen === 'signup' && (
          <View style={styles.signupScreenContainer}>
            <ScrollView
              style={styles.signupFormScroll}
              contentContainerStyle={[styles.authScrollContent, styles.signupScrollContent]}
              keyboardShouldPersistTaps="handled"
              accessible={false}
              testID="signup-screen"
              accessibilityLabel="signup-screen"
            >
            <View style={styles.authHeader}>
              <View style={styles.appLogoBadge}>
                <Text style={styles.appLogoText}>A</Text>
              </View>
              <Text
                style={styles.mainTitle}
                testID="signup-title"
                accessibilityLabel="signup-title"
              >
                Create Account
              </Text>
              <Text style={styles.mainSubtitle}>Start your seamless journey with us</Text>
            </View>

            <View style={styles.authCard}>
              {!!signupError && (
                <View
                  style={styles.errorContainer}
                  testID="signup-error-container"
                  accessibilityLabel="signup-error-container"
                >
                  <Text
                    style={styles.errorText}
                    testID="signup-error-text"
                  >
                    {signupError}
                  </Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  editable={true}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#94a3b8"
                  value={signupName}
                  onChangeText={(value) => {
                    setSignupName(value);
                    if (signupError) setSignupError('');
                  }}
                  autoCorrect={false}
                  autoCapitalize="words"
                  testID="signup-name-input"
                  accessibilityLabel="signup-name-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  editable={true}
                  placeholder="name@example.com"
                  placeholderTextColor="#94a3b8"
                  value={signupEmail}
                  onChangeText={(value) => {
                    setSignupEmail(value);
                    if (signupError) setSignupError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  testID="signup-email-input"
                  accessibilityLabel="signup-email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  editable={true}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={signupPassword}
                  onChangeText={(value) => {
                    setSignupPassword(value);
                    if (signupError) setSignupError('');
                  }}
                  secureTextEntry
                  textContentType="oneTimeCode"
                  autoComplete="off"
                  testID="signup-password-input"
                  accessibilityLabel="signup-password-input"
                />
              </View>

              <View style={styles.authFooterRow}>
                <Text style={styles.footerPromptText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSignupError('');
                    setCurrentScreen('login');
                  }}
                  testID="goto-login-button"
                  accessibilityLabel="goto-login-button"
                >
                  <Text style={styles.footerLinkText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
            </ScrollView>
            <View style={styles.signupStickyFooter}>
              <TouchableOpacity
                style={[styles.primaryAuthButton, styles.signupStickyButton]}
                onPress={handleSignup}
                testID="signup-submit-button"
                accessibilityLabel="signup-submit-button"
                accessibilityRole="button"
                activeOpacity={0.85}
              >
                <Text style={styles.primaryAuthButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================== HOME SCREEN ===================== */}
        {currentScreen === 'home' && (
          <ScrollView
            contentContainerStyle={styles.homeScrollContent}
            accessible={false}
            testID="home-screen"
            accessibilityLabel="home-screen"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
              <View style={styles.userInfoRow}>
                <View style={styles.avatarBubble}>
                  <Text style={styles.avatarLetter}>
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
                <View style={styles.welcomeInfo}>
                  <Text
                    style={styles.welcomeGreeting}
                    testID="home-welcome-title"
                    accessibilityLabel="home-welcome-title"
                  >
                    Welcome Home!
                  </Text>
                  <Text
                    style={styles.headerUserName}
                    testID="home-user-name"
                  >
                    {currentUser?.name || 'Valued User'}
                  </Text>
                </View>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerLogoutButton}
                  onPress={promptLogout}
                  testID="logout-button"
                  accessibilityLabel="logout-button"
                  accessibilityRole="button"
                >
                  <Text style={styles.headerLogoutButtonText}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconNavBtn}
                  onPress={() => setCurrentScreen('settings')}
                  testID="nav-settings-header-btn"
                  accessibilityLabel="nav-settings-header-btn"
                >
                  <Text style={styles.iconNavText}>⚙️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Email Identification Badge */}
            <View style={styles.identityCard}>
              <Text style={styles.identityLabel}>Active Account</Text>
              <Text
                style={styles.identityEmail}
                testID="home-user-email"
              >
                {currentUser?.email || ''}
              </Text>
            </View>

            {/* Financial / Overview Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Total Portfolio Balance</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>+12.4%</Text>
                </View>
              </View>
              <Text style={styles.balanceValue}>$24,850.00</Text>
              <View style={styles.balanceStatsRow}>
                <View style={styles.balanceStatItem}>
                  <Text style={styles.balanceStatLabel}>Monthly Inflow</Text>
                  <Text style={styles.balanceStatAmountPositive}>+$5,420.00</Text>
                </View>
                <View style={styles.balanceStatDivider} />
                <View style={styles.balanceStatItem}>
                  <Text style={styles.balanceStatLabel}>Expenses</Text>
                  <Text style={styles.balanceStatAmountNegative}>-$1,840.50</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions Grid */}
            <Text style={styles.sectionHeading}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => setCurrentScreen(action.id)}
                  testID={`action-${action.id}-button`}
                  accessibilityLabel={`action-${action.id}-button`}
                >
                  <View style={styles.quickActionIconWrap}>
                    <Text style={styles.quickActionIcon}>{action.iconText}</Text>
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent Activity List */}
            <View style={styles.activitySectionHeader}>
              <Text style={styles.sectionHeading}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setCurrentScreen('transactions')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityListCard}>
              {recentActivities.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.activityItemRow}>
                    <View style={styles.activityIconCircle}>
                      <Text style={styles.activityIconEmoji}>
                        {item.type === 'incoming' ? '↙' : '↗'}
                      </Text>
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityTitle}>{item.title}</Text>
                      <Text style={styles.activitySubtitle}>{item.category} • {item.time}</Text>
                    </View>
                    <Text
                      style={[
                        styles.activityAmount,
                        item.type === 'incoming' ? styles.incomeAmount : styles.expenseAmount,
                      ]}
                    >
                      {item.amount}
                    </Text>
                  </View>
                  {index < recentActivities.length - 1 && <View style={styles.itemDivider} />}
                </View>
              ))}
            </View>

          </ScrollView>
        )}

        {/* ===================== DEMO SCREEN 1: ANALYTICS ===================== */}
        {currentScreen === 'analytics' && (
          <ScrollView
            contentContainerStyle={styles.demoScrollContent}
            accessible={false}
            testID="analytics-screen"
            accessibilityLabel="analytics-screen"
          >
            <View style={styles.navBackHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentScreen('home')}
                testID="back-to-home-btn"
                accessibilityLabel="back-to-home-btn"
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.screenHeaderTitle}>Analytics</Text>
              <TouchableOpacity
                style={styles.periodSelector}
                onPress={() => setAnalyticsPeriod(analyticsPeriod === 'Month' ? 'Quarter' : 'Month')}
                testID="analytics-period-toggle"
                accessibilityLabel="analytics-period-toggle"
              >
                <Text style={styles.periodSelectorText} testID="analytics-period-value">
                  {analyticsPeriod}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Metrics cards */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total Spent</Text>
                <Text style={styles.metricValue} testID="analytics-spending-total">
                  {analyticsPeriod === 'Month' ? '$4,320' : '$12,400'}
                </Text>
                <Text style={styles.metricChangeNegative}>+8.2% vs last mo</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total Earned</Text>
                <Text style={styles.metricValue}>
                  {analyticsPeriod === 'Month' ? '$9,850' : '$27,600'}
                </Text>
                <Text style={styles.metricChangePositive}>+15.4% vs last mo</Text>
              </View>
            </View>

            {/* Performance Overview Chart Simulation */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Monthly Spending Trend</Text>
              <View style={styles.chartBarsContainer}>
                {[
                  { month: 'Jun', height: 45 },
                  { month: 'Jul', height: 65 },
                  { month: 'Aug', height: 50 },
                  { month: 'Sep', height: 85 },
                  { month: 'Oct', height: 70 },
                  { month: 'Nov', height: 95 },
                ].map((bar, idx) => (
                  <View key={idx} style={styles.chartBarCol}>
                    <View style={[styles.chartBarFill, { height: `${bar.height}%` }]} />
                    <Text style={styles.chartBarLabel}>{bar.month}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Breakdown */}
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Category Breakdown</Text>
              {[
                { name: 'Business & Cloud', pct: '45%', amount: '$1,944' },
                { name: 'Office & Workspace', pct: '30%', amount: '$1,296' },
                { name: 'Travel & Commute', pct: '15%', amount: '$648' },
                { name: 'Subscriptions', pct: '10%', amount: '$432' },
              ].map((item, idx) => (
                <View key={idx} style={styles.breakdownRow}>
                  <Text style={styles.breakdownName}>{item.name}</Text>
                  <View style={styles.breakdownValues}>
                    <Text style={styles.breakdownPct}>{item.pct}</Text>
                    <Text style={styles.breakdownAmount}>{item.amount}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ===================== DEMO SCREEN 2: TRANSACTIONS ===================== */}
        {currentScreen === 'transactions' && (
          <ScrollView
            contentContainerStyle={styles.demoScrollContent}
            accessible={false}
            testID="transactions-screen"
            accessibilityLabel="transactions-screen"
          >
            <View style={styles.navBackHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentScreen('home')}
                testID="transactions-back-btn"
                accessibilityLabel="transactions-back-btn"
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.screenHeaderTitle}>Transactions</Text>
              <View style={{ width: 60 }} />
            </View>

            <View style={styles.transactionSummaryCard}>
              <Text style={styles.transactionSummaryLabel}>This month</Text>
              <Text style={styles.transactionSummaryAmount}>$1,110.01</Text>
              <Text style={styles.transactionSummaryCaption} testID="transaction-count">
                {filteredTransactions.length} recent transaction
                {filteredTransactions.length === 1 ? '' : 's'}
              </Text>
            </View>

            <View style={styles.transactionFilters}>
              {([
                ['all', 'All'],
                ['incoming', 'Income'],
                ['outgoing', 'Expenses'],
              ] as const).map(([filter, label]) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.transactionFilter,
                    transactionFilter === filter && styles.transactionFilterActive,
                  ]}
                  onPress={() => setTransactionFilter(filter)}
                  testID={`transaction-filter-${filter}`}
                  accessibilityLabel={`transaction-filter-${filter}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: transactionFilter === filter }}
                >
                  <Text
                    style={[
                      styles.transactionFilterText,
                      transactionFilter === filter && styles.transactionFilterTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionHeading}>Recent activity</Text>
            <View style={styles.activityListCard}>
              {filteredTransactions.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.activityItemRow}>
                    <View style={styles.activityIconCircle}>
                      <Text style={styles.activityIconEmoji}>
                        {item.type === 'incoming' ? '↙' : '↗'}
                      </Text>
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityTitle} testID={`transaction-title-${item.id}`}>
                        {item.title}
                      </Text>
                      <Text style={styles.activitySubtitle}>{item.category} • {item.time}</Text>
                    </View>
                    <Text
                      style={[
                        styles.activityAmount,
                        item.type === 'incoming' ? styles.incomeAmount : styles.expenseAmount,
                      ]}
                    >
                      {item.amount}
                    </Text>
                  </View>
                  {index < recentActivities.length - 1 && <View style={styles.itemDivider} />}
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ===================== DEMO SCREEN 3: BUDGET ===================== */}
        {currentScreen === 'budget' && (
          <ScrollView
            contentContainerStyle={styles.demoScrollContent}
            accessible={false}
            testID="budget-screen"
            accessibilityLabel="budget-screen"
          >
            <View style={styles.navBackHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentScreen('home')}
                testID="budget-back-btn"
                accessibilityLabel="budget-back-btn"
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.screenHeaderTitle}>Monthly Budget</Text>
              <View style={{ width: 60 }} />
            </View>

            <View style={styles.budgetSummaryCard}>
              <Text style={styles.budgetSummaryLabel}>Available to spend</Text>
              <Text style={styles.budgetSummaryAmount}>$1,170</Text>
              <Text style={styles.budgetSummaryCaption}>of $4,270 monthly budget</Text>
              <View style={styles.budgetTrack}>
                <View style={[styles.budgetFill, { width: '73%' }]} />
              </View>
              <Text style={styles.budgetSummaryCaption}>73% used · 12 days left</Text>
            </View>

            <Text style={styles.sectionHeading}>Spending limits</Text>
            {budgetCategories.map((category) => {
              const percent = Math.min((category.spent / category.limit) * 100, 100);
              return (
                <View key={category.name} style={styles.budgetCategoryCard}>
                  <View style={styles.budgetCategoryHeader}>
                    <Text style={styles.budgetCategoryName}>{category.name}</Text>
                    <View style={styles.budgetAdjustControls}>
                      <Text style={styles.budgetCategoryAmount}>Limit</Text>
                      <TouchableOpacity
                        style={styles.budgetAdjustButton}
                        onPress={() =>
                          setBudgetLimits((previous) => ({
                            ...previous,
                            [category.id]: Math.max(category.spent + 100, previous[category.id] - 100),
                          }))
                        }
                        testID={`budget-decrease-${category.id}`}
                        accessibilityLabel={`budget-decrease-${category.id}`}
                        accessibilityRole="button"
                      >
                        <Text style={styles.budgetAdjustButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.budgetLimitValue} testID={`budget-limit-${category.id}`}>
                        ${category.limit.toLocaleString('en-US')}
                      </Text>
                      <TouchableOpacity
                        style={styles.budgetAdjustButton}
                        onPress={() =>
                          setBudgetLimits((previous) => ({
                            ...previous,
                            [category.id]: previous[category.id] + 100,
                          }))
                        }
                        testID={`budget-increase-${category.id}`}
                        accessibilityLabel={`budget-increase-${category.id}`}
                        accessibilityRole="button"
                      >
                        <Text style={styles.budgetAdjustButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.budgetSpentText}>
                    ${category.spent.toLocaleString('en-US')} spent
                  </Text>
                  <View style={styles.budgetTrack}>
                    <View
                      style={[
                        styles.budgetFill,
                        { width: `${percent}%`, backgroundColor: category.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* ===================== DEMO SCREEN 4: SETTINGS & PROFILE ===================== */}
        {currentScreen === 'settings' && (
          <ScrollView
            contentContainerStyle={styles.demoScrollContent}
            accessible={false}
            testID="settings-screen"
            accessibilityLabel="settings-screen"
          >
            <View style={styles.navBackHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentScreen('home')}
                testID="settings-back-btn"
                accessibilityLabel="settings-back-btn"
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.screenHeaderTitle}>Settings</Text>
              <View style={{ width: 60 }} />
            </View>

            {/* Profile Overview */}
            <View style={styles.settingsProfileCard}>
              <View style={styles.settingsAvatarCircle}>
                <Text style={styles.settingsAvatarText}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
              <Text style={styles.settingsProfileName}>{currentUser?.name || 'User'}</Text>
              <Text style={styles.settingsProfileEmail}>{currentUser?.email || ''}</Text>
            </View>

            {/* Preferences Section */}
            <View style={styles.settingsSectionCard}>
              <Text style={styles.settingsGroupHeader}>Preferences</Text>

              <TouchableOpacity
                style={styles.settingsRow}
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                testID="settings-notifications-toggle"
                accessibilityLabel="settings-notifications-toggle"
                accessibilityRole="button"
              >
                <Text style={styles.settingsRowLabel}>Push Notifications</Text>
                <Text style={styles.settingsRowValue} testID="settings-notifications-value">
                  {notificationsEnabled ? 'Enabled  ✓' : 'Disabled  ✕'}
                </Text>
              </TouchableOpacity>

              <View style={styles.itemDivider} />

              <TouchableOpacity
                style={styles.settingsRow}
                onPress={() => setDarkModeEnabled(!darkModeEnabled)}
                testID="settings-appearance-toggle"
                accessibilityLabel="settings-appearance-toggle"
                accessibilityRole="button"
              >
                <Text style={styles.settingsRowLabel}>Appearance</Text>
                <Text style={styles.settingsRowValue} testID="settings-appearance-value">
                  {darkModeEnabled ? 'Dark Theme' : 'Light Theme'}
                </Text>
              </TouchableOpacity>

              <View style={styles.itemDivider} />

              <View style={styles.settingsRow}>
                <Text style={styles.settingsRowLabel}>Currency</Text>
                <Text style={styles.settingsRowValue}>USD ($)</Text>
              </View>
            </View>

            {/* Security Section */}
            <View style={styles.settingsSectionCard}>
              <Text style={styles.settingsGroupHeader}>Security & Privacy</Text>

              <TouchableOpacity
                style={styles.settingsRow}
                onPress={() => Alert.alert('Security', 'Two-Factor Authentication is active.')}
              >
                <Text style={styles.settingsRowLabel}>Two-Factor Authentication</Text>
                <Text style={styles.settingsRowValue}>Active 🛡</Text>
              </TouchableOpacity>

              <View style={styles.itemDivider} />

              <TouchableOpacity
                style={styles.settingsRow}
                onPress={() => Alert.alert('App Version', 'Version 1.2.0 (Build 2026)')}
              >
                <Text style={styles.settingsRowLabel}>App Version</Text>
                <Text style={styles.settingsRowValue}>v1.2.0</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Out Trigger from Settings */}
            <TouchableOpacity
              style={styles.settingsLogoutButton}
              onPress={promptLogout}
              testID="settings-logout-btn"
              accessibilityLabel="settings-logout-btn"
            >
              <Text style={styles.settingsLogoutBtnText}>Log Out</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        </Animated.View>

        {/* ===================== LOGOUT CONFIRMATION MODAL / ALERT ===================== */}
        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View style={styles.modalOverlay} accessible={false}>
            <View style={styles.alertCard} accessible={false}>
              <View style={styles.alertIconBubble}>
                <Text style={styles.alertIconEmoji}>⚠️</Text>
              </View>
              <Text
                style={styles.alertTitle}
                testID="logout-alert-title"
                accessibilityLabel="logout-alert-title"
              >
                Confirm Logout
              </Text>
              <Text style={styles.alertMessage}>
                Are you sure you want to sign out of your account? You will need to log back in.
              </Text>
              <View style={styles.alertActionButtons}>
                <TouchableOpacity
                  style={styles.alertCancelBtn}
                  onPress={() => setShowLogoutModal(false)}
                  accessible
                  accessibilityRole="button"
                  testID="logout-cancel-button"
                  accessibilityLabel="logout-cancel-button"
                >
                  <Text style={styles.alertCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.alertConfirmBtn}
                  onPress={confirmLogoutAction}
                  accessible
                  accessibilityRole="button"
                  testID="logout-confirm-button"
                  accessibilityLabel="logout-confirm-button"
                >
                  <Text style={styles.alertConfirmBtnText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  screenTransition: {
    flex: 1,
  },

  // Auth Layout
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  signupScreenContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  signupFormScroll: {
    flex: 1,
  },
  signupScrollContent: {
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  signupStickyFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  signupStickyButton: {
    marginTop: 0,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  appLogoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  appLogoText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  mainSubtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  primaryAuthButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryAuthButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  authFooterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerPromptText: {
    color: '#64748b',
    fontSize: 14,
  },
  footerLinkText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },

  // Home Screen Layout
  homeScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  welcomeInfo: {
    justifyContent: 'center',
  },
  welcomeGreeting: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerUserName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogoutButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  headerLogoutButtonText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '700',
  },
  iconNavBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconNavText: {
    fontSize: 18,
  },

  // Account Identity Card
  identityCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  identityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  identityEmail: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
  },

  // Balance Card
  balanceCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  statusPill: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '700',
  },
  balanceValue: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 20,
  },
  balanceStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 12,
  },
  balanceStatItem: {
    flex: 1,
  },
  balanceStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  balanceStatLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceStatAmountPositive: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '700',
  },
  balanceStatAmountNegative: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '700',
  },

  // Quick Actions Grid
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },

  // Activity List
  activitySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '700',
  },
  activityListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activityItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityIconEmoji: {
    fontSize: 18,
    fontWeight: '800',
    color: '#334155',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#16a34a',
  },
  expenseAmount: {
    color: '#0f172a',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },

  // Demo Screens Layout
  demoScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  navBackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4f46e5',
  },
  screenHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  periodSelector: {
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 12,
  },
  periodSelectorText: {
    color: '#4338ca',
    fontSize: 13,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  metricChangePositive: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '700',
  },
  metricChangeNegative: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 18,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  chartBarCol: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 32,
  },
  chartBarFill: {
    width: 14,
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  breakdownTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  breakdownName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  breakdownValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownPct: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  breakdownAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  transactionSummaryCard: {
    backgroundColor: '#312e81',
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
  },
  transactionSummaryLabel: {
    color: '#c7d2fe',
    fontSize: 13,
    fontWeight: '600',
  },
  transactionSummaryAmount: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },
  transactionSummaryCaption: {
    color: '#c7d2fe',
    fontSize: 12,
    marginTop: 4,
  },
  transactionFilters: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  transactionFilter: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
  },
  transactionFilterActive: {
    backgroundColor: '#312e81',
    borderColor: '#312e81',
  },
  transactionFilterText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  transactionFilterTextActive: {
    color: '#ffffff',
  },
  budgetSummaryCard: {
    backgroundColor: '#312e81',
    borderRadius: 20,
    padding: 22,
    marginBottom: 22,
  },
  budgetSummaryLabel: {
    color: '#c7d2fe',
    fontSize: 13,
    fontWeight: '600',
  },
  budgetSummaryAmount: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 8,
  },
  budgetSummaryCaption: {
    color: '#c7d2fe',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  budgetTrack: {
    height: 9,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  budgetFill: {
    height: '100%',
    backgroundColor: '#a5b4fc',
    borderRadius: 8,
  },
  budgetCategoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  budgetCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategoryName: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  budgetCategoryAmount: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  budgetAdjustControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetAdjustButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 15,
  },
  budgetAdjustButtonText: {
    color: '#4338ca',
    fontSize: 18,
    fontWeight: '700',
  },
  budgetLimitValue: {
    minWidth: 58,
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
  budgetSpentText: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 10,
  },

  // Settings Screen
  settingsProfileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingsAvatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsAvatarText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
  settingsProfileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  settingsProfileEmail: {
    fontSize: 13,
    color: '#64748b',
  },
  settingsSectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingsGroupHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsRowLabel: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  settingsRowValue: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '600',
  },
  settingsLogoutButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  settingsLogoutBtnText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '700',
  },

  // Logout Alert Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  alertIconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIconEmoji: {
    fontSize: 26,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  alertActionButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  alertCancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  alertCancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  alertConfirmBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
  },
  alertConfirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
