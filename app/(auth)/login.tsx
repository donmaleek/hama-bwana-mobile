import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication
      const mockUsers = [
        { email: "demo@example.com", password: "password123" },
        { email: "test@example.com", password: "test123" }
      ];

      const user = mockUsers.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user || (formData.email && formData.password)) {
        console.log("Login successful:", formData.email);
        router.replace("/(tabs)");
      } else {
        // Show elegant error with animation
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          })
        ]).start();
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleDemoLogin = (demoType: 'tenant' | 'landlord' | 'agent') => {
    const demoAccounts = {
      tenant: { email: "tenant@hamabwana.com", password: "demo123" },
      landlord: { email: "landlord@hamabwana.com", password: "demo123" },
      agent: { email: "agent@hamabwana.com", password: "demo123" }
    };

    setFormData(demoAccounts[demoType]);
    
    // Pulse animation for demo login
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    // Implement social login logic
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.patternCircle1} />
        <View style={styles.patternCircle2} />
        <View style={styles.patternCircle3} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Ionicons name="home" size={32} color="#003366" />
                </View>
                <Text style={styles.logoText}>Hama Bwana</Text>
              </View>
              
              <Text style={styles.title}>Karibu Tena!</Text>
              <Text style={styles.subtitle}>Find your perfect home in Kenya</Text>
              
              {/* Quick Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50K+</Text>
                  <Text style={styles.statLabel}>Properties</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>24</Text>
                  <Text style={styles.statLabel}>Cities</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>98%</Text>
                  <Text style={styles.statLabel}>Satisfaction</Text>
                </View>
              </View>
            </View>

            {/* Demo Accounts - Quick Access */}
            <View style={styles.demoSection}>
              <Text style={styles.sectionTitle}>Quick Demo Access</Text>
              <Text style={styles.sectionSubtitle}>Experience Hama Bwana instantly</Text>
              
              <View style={styles.demoButtons}>
                <TouchableOpacity 
                  style={[styles.demoButton, styles.tenantButton]}
                  onPress={() => handleDemoLogin('tenant')}
                >
                  <View style={styles.demoIconContainer}>
                    <Ionicons name="person-outline" size={20} color="#2E8B57" />
                  </View>
                  <View style={styles.demoTextContainer}>
                    <Text style={styles.demoButtonTitle}>Tenant</Text>
                    <Text style={styles.demoButtonSubtitle}>Find rentals</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.demoButton, styles.landlordButton]}
                  onPress={() => handleDemoLogin('landlord')}
                >
                  <View style={styles.demoIconContainer}>
                    <Ionicons name="business-outline" size={20} color="#DAA520" />
                  </View>
                  <View style={styles.demoTextContainer}>
                    <Text style={styles.demoButtonTitle}>Landlord</Text>
                    <Text style={styles.demoButtonSubtitle}>List property</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.demoButton, styles.agentButton]}
                  onPress={() => handleDemoLogin('agent')}
                >
                  <View style={styles.demoIconContainer}>
                    <Ionicons name="briefcase-outline" size={20} color="#003366" />
                  </View>
                  <View style={styles.demoTextContainer}>
                    <Text style={styles.demoButtonTitle}>Agent</Text>
                    <Text style={styles.demoButtonSubtitle}>Manage listings</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Form */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Sign In to Your Account</Text>
              
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Email Address"
                    placeholderTextColor="#999"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {errors.email && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={14} color="#FF4444" />
                    <Text style={styles.errorText}>{errors.email}</Text>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    autoComplete="password"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={14} color="#FF4444" />
                    <Text style={styles.errorText}>{errors.password}</Text>
                  </View>
                )}

                {/* Forgot Password */}
                <TouchableOpacity 
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity 
                  style={[styles.loginButton, isLoading && styles.buttonDisabled]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Ionicons name="log-in-outline" size={20} color="white" />
                      <Text style={styles.loginButtonText}>Sign In</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialSection}>
              <View style={styles.socialButtons}>
                <TouchableOpacity 
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => handleSocialLogin('google')}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => handleSocialLogin('facebook')}
                >
                  <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Link */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>New to Hama Bwana?</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Indicators */}
            <View style={styles.trustSection}>
              <Text style={styles.trustTitle}>Kenya's Most Trusted Rental Platform</Text>
              <View style={styles.trustBadges}>
                <View style={styles.trustBadge}>
                  <Ionicons name="shield-checkmark" size={16} color="#2E8B57" />
                  <Text style={styles.trustBadgeText}>Verified Listings</Text>
                </View>
                <View style={styles.trustBadge}>
                  <Ionicons name="star" size={16} color="#DAA520" />
                  <Text style={styles.trustBadgeText}>5-Star Reviews</Text>
                </View>
                <View style={styles.trustBadge}>
                  <Ionicons name="location" size={16} color="#003366" />
                  <Text style={styles.trustBadgeText}>Nationwide</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  patternCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 51, 102, 0.03)',
  },
  patternCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(218, 165, 32, 0.03)',
  },
  patternCircle3: {
    position: 'absolute',
    top: '40%',
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(46, 139, 87, 0.03)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 25,
    justifyContent: "center",
  },
  animatedContainer: {
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#003366",
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e9ecef',
    marginHorizontal: 10,
  },
  demoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "500",
  },
  demoButtons: {
    gap: 12,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tenantButton: {
    borderColor: '#2E8B57',
    backgroundColor: '#f0f9f4',
  },
  landlordButton: {
    borderColor: '#DAA520',
    backgroundColor: '#fef9e7',
  },
  agentButton: {
    borderColor: '#003366',
    backgroundColor: '#f0f4ff',
  },
  demoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  demoTextContainer: {
    flex: 1,
  },
  demoButtonTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 2,
  },
  demoButtonSubtitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  formSection: {
    marginBottom: 25,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  passwordInput: {
    paddingRight: 50,
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 8,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
    position: 'absolute',
    right: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#0033A0",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#003366",
    padding: 18,
    borderRadius: 12,
    shadowColor: "#003366",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  socialSection: {
    marginBottom: 25,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    borderColor: '#DB4437',
  },
  facebookButton: {
    borderColor: '#4267B2',
  },
  socialButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  registerText: {
    color: "#666",
    fontSize: 16,
    marginRight: 8,
    fontWeight: '500',
  },
  registerLink: {
    color: "#0033A0",
    fontSize: 16,
    fontWeight: "700",
  },
  trustSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginTop: 10,
  },
  trustTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 12,
    textAlign: 'center',
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trustBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginLeft: 4,
  },
});