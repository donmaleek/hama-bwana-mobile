import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
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

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    password: "",
    phone: "",
    userType: "tenant" // 'tenant', 'landlord', or 'agent'
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
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

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    if (!profileImage) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - navigate to appropriate screen based on user type
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderText = () => {
    switch (formData.userType) {
      case 'tenant':
        return "Tell us about yourself and what you're looking for in a rental...";
      case 'landlord':
        return "Tell us about your properties and rental experience...";
      case 'agent':
        return "Tell us about your real estate experience and specialties...";
      default:
        return "Tell us about yourself...";
    }
  };

  const getUserTypeBenefits = () => {
    switch (formData.userType) {
      case 'tenant':
        return [
          "✓ Find verified rentals",
          "✓ Schedule viewings instantly",
          "✓ Get landlord reviews",
          "✓ Secure online applications"
        ];
      case 'landlord':
        return [
          "✓ List properties for free",
          "✓ Tenant background checks",
          "✓ Digital lease agreements",
          "✓ Rent collection tools"
        ];
      case 'agent':
        return [
          "✓ Professional profile",
          "✓ Lead generation",
          "✓ Property management tools",
          "✓ Commission tracking"
        ];
      default:
        return [];
    }
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
              
              <Text style={styles.title}>Join Hama Bwana</Text>
              <Text style={styles.subtitle}>Kenya's #1 Rental Platform</Text>
            </View>

            {/* Profile Image Section */}
            <View style={styles.imageSection}>
              <TouchableOpacity onPress={pickImage}>
                {profileImage ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: profileImage }} style={styles.image} />
                    <TouchableOpacity 
                      style={styles.editImageButton}
                      onPress={pickImage}
                    >
                      <Ionicons name="camera" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="person" size={40} color="#666" />
                    <Text style={styles.imagePlaceholderText}>Add Profile Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.imageActions}>
                <TouchableOpacity style={styles.imageActionButton} onPress={pickImage}>
                  <Ionicons name="image-outline" size={18} color="#003366" />
                  <Text style={styles.imageActionText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.imageActionButton} onPress={takePhoto}>
                  <Ionicons name="camera-outline" size={18} color="#003366" />
                  <Text style={styles.imageActionText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* User Type Selection */}
            <View style={styles.userTypeSection}>
              <Text style={styles.sectionTitle}>I am a:</Text>
              <View style={styles.userTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.userTypeCard,
                    formData.userType === 'tenant' && styles.userTypeCardActive
                  ]}
                  onPress={() => handleInputChange('userType', 'tenant')}
                >
                  <View style={styles.userTypeIconContainer}>
                    <Ionicons 
                      name="person-outline" 
                      size={24} 
                      color={formData.userType === 'tenant' ? 'white' : '#2E8B57'} 
                    />
                  </View>
                  <Text style={[
                    styles.userTypeTitle,
                    formData.userType === 'tenant' && styles.userTypeTitleActive
                  ]}>
                    Tenant
                  </Text>
                  <Text style={styles.userTypeSubtitle}>Looking for a rental</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.userTypeCard,
                    formData.userType === 'landlord' && styles.userTypeCardActive
                  ]}
                  onPress={() => handleInputChange('userType', 'landlord')}
                >
                  <View style={styles.userTypeIconContainer}>
                    <Ionicons 
                      name="business-outline" 
                      size={24} 
                      color={formData.userType === 'landlord' ? 'white' : '#DAA520'} 
                    />
                  </View>
                  <Text style={[
                    styles.userTypeTitle,
                    formData.userType === 'landlord' && styles.userTypeTitleActive
                  ]}>
                    Landlord
                  </Text>
                  <Text style={styles.userTypeSubtitle}>Renting out property</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.userTypeCard,
                    formData.userType === 'agent' && styles.userTypeCardActive
                  ]}
                  onPress={() => handleInputChange('userType', 'agent')}
                >
                  <View style={styles.userTypeIconContainer}>
                    <Ionicons 
                      name="briefcase-outline" 
                      size={24} 
                      color={formData.userType === 'agent' ? 'white' : '#003366'} 
                    />
                  </View>
                  <Text style={[
                    styles.userTypeTitle,
                    formData.userType === 'agent' && styles.userTypeTitleActive
                  ]}>
                    Agent
                  </Text>
                  <Text style={styles.userTypeSubtitle}>Real estate professional</Text>
                </TouchableOpacity>
              </View>

              {/* User Type Benefits */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Benefits for {formData.userType}s:</Text>
                {getUserTypeBenefits().map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#2E8B57" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Your Information</Text>
              
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Full Name *"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.name && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={14} color="#FF4444" />
                    <Text style={styles.errorText}>{errors.name}</Text>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Email Address *"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.email && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={14} color="#FF4444" />
                    <Text style={styles.errorText}>{errors.email}</Text>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.phone && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={14} color="#FF4444" />
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                    placeholder="Password *"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
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

                <View style={styles.inputContainer}>
                  <Ionicons name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                    placeholder={getPlaceholderText()}
                    value={formData.description}
                    onChangeText={(value) => handleInputChange('description', value)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.description && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={14} color="#FF4444" />
                    <Text style={styles.errorText}>{errors.description}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.buttonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="person-add" size={20} color="white" />
                  <Text style={styles.registerButtonText}>Create Account</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Indicators */}
            <View style={styles.trustSection}>
              <Text style={styles.trustTitle}>Join 100,000+ Kenyans on Hama Bwana</Text>
              <View style={styles.trustBadges}>
                <View style={styles.trustBadge}>
                  <Ionicons name="shield-checkmark" size={16} color="#2E8B57" />
                  <Text style={styles.trustBadgeText}>Secure & Verified</Text>
                </View>
                <View style={styles.trustBadge}>
                  <Ionicons name="star" size={16} color="#DAA520" />
                  <Text style={styles.trustBadgeText}>5-Star Platform</Text>
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
  },
  animatedContainer: {
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontWeight: "500",
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#003366",
  },
  editImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#003366',
    borderRadius: 15,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#003366",
    borderStyle: "dashed",
    marginBottom: 15,
  },
  imagePlaceholderText: {
    color: "#003366",
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#003366',
  },
  imageActionText: {
    color: "#003366",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  userTypeSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  userTypeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  userTypeCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  userTypeCardActive: {
    backgroundColor: "#003366",
    borderColor: "#003366",
  },
  userTypeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userTypeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
    textAlign: 'center',
  },
  userTypeTitleActive: {
    color: "white",
  },
  userTypeSubtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: 'center',
    fontWeight: "500",
  },
  benefitsContainer: {
    backgroundColor: '#f0f9f4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E8B57',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  registerButton: {
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
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  loginText: {
    color: "#666",
    fontSize: 16,
    marginRight: 8,
    fontWeight: '500',
  },
  loginLink: {
    color: "#0033A0",
    fontSize: 16,
    fontWeight: "700",
  },
  trustSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
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