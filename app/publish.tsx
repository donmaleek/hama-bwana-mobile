// app/publish.tsx
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FormData {
  title: string;
  price: string;
  description: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  amenities: string;
  propertyType: string;
  leaseTerm: string;
  deposit: string;
  availableFrom: string;
  petFriendly: boolean;
  furnished: boolean;
}

export default function Publish() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    description: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    amenities: "",
    propertyType: "",
    leaseTerm: "1 year",
    deposit: "",
    availableFrom: "",
    petFriendly: false,
    furnished: false
  });
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Property type options
  const propertyTypes = [
    { id: 'apartment', label: 'Apartment', icon: 'business' },
    { id: 'house', label: 'House', icon: 'home' },
    { id: 'studio', label: 'Studio', icon: 'square' },
    { id: 'townhouse', label: 'Townhouse', icon: 'business' },
    { id: 'condo', label: 'Condo', icon: 'business' },
    { id: 'villa', label: 'Villa', icon: 'home' },
  ];

  // Lease term options
  const leaseTerms = [
    { id: 'monthly', label: 'Monthly' },
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: '1year', label: '1 Year' },
    { id: '2years', label: '2+ Years' },
  ];

  // Common amenities
  const commonAmenities = [
    'WiFi', 'Parking', 'Security', 'Gym', 'Swimming Pool', 
    'Backup Generator', 'Water Heater', 'Balcony', 'Garden',
    'Pet Friendly', 'Furnished', 'Air Conditioning', 'Heating'
  ];

  // Animation for form steps
  const animateForm = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Request media permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
      return false;
    }
    return true;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Pick images
  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: false,
      selectionLimit: 10 - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Pick video
  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets) {
      setVideo(result.assets[0].uri);
    }
  };

  // Remove video
  const removeVideo = () => {
    setVideo(null);
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to take photos!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  // Toggle amenity
  const toggleAmenity = (amenity: string) => {
    const currentAmenities = formData.amenities.split(',').filter(a => a.trim());
    if (currentAmenities.includes(amenity)) {
      const newAmenities = currentAmenities.filter(a => a !== amenity);
      handleInputChange('amenities', newAmenities.join(', '));
    } else {
      const newAmenities = [...currentAmenities, amenity];
      handleInputChange('amenities', newAmenities.join(', '));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = "Property title is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price amount";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Please select property type";
    }

    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      animateForm();
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  // Handle previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      animateForm();
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  // Simulate upload progress
  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    simulateUpload();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      Alert.alert(
        "Success! 🎉",
        "Your rental property has been published successfully!",
        [
          {
            text: "View Listing",
            onPress: () => {
              resetForm();
              router.push("/(tabs)/profile");
            }
          },
          {
            text: "Add Another",
            style: "cancel",
            onPress: () => resetForm()
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to publish rental. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      amenities: "",
      propertyType: "",
      leaseTerm: "1 year",
      deposit: "",
      availableFrom: "",
      petFriendly: false,
      furnished: false
    });
    setImages([]);
    setVideo(null);
    setErrors({});
    setCurrentStep(1);
  };

  const isFormValid = formData.title.trim() && 
                     formData.price.trim() && 
                     formData.description.trim() && 
                     formData.location.trim() && 
                     images.length > 0;

  // Render step indicator
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            step === currentStep && styles.stepCircleActive,
            step < currentStep && styles.stepCircleCompleted
          ]}>
            {step < currentStep ? (
              <Ionicons name="checkmark" size={16} color="white" />
            ) : (
              <Text style={[
                styles.stepText,
                step === currentStep && styles.stepTextActive
              ]}>
                {step}
              </Text>
            )}
          </View>
          <Text style={[
            styles.stepLabel,
            step === currentStep && styles.stepLabelActive
          ]}>
            {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Media'}
          </Text>
        </View>
      ))}
    </View>
  );

  // Render step 1: Basic Information
  const renderStep1 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Property Title *</Text>
        <TextInput
          placeholder="e.g., Modern 2 Bedroom Apartment in Kilimani"
          value={formData.title}
          onChangeText={(value) => handleInputChange('title', value)}
          style={[styles.input, errors.title && styles.inputError]}
          placeholderTextColor="#999"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>Monthly Price (Ksh) *</Text>
          <TextInput
            placeholder="45,000"
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
            keyboardType="numeric"
            style={[styles.input, errors.price && styles.inputError]}
            placeholderTextColor="#999"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Location *</Text>
          <TextInput
            placeholder="e.g., Kilimani, Nairobi"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            style={[styles.input, errors.location && styles.inputError]}
            placeholderTextColor="#999"
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Property Description *</Text>
        <TextInput
          placeholder="Describe your property in detail..."
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
        <Text style={styles.charCount}>
          {formData.description.length}/500 characters
        </Text>
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>
    </Animated.View>
  );

  // Render step 2: Property Details
  const renderStep2 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.sectionTitle}>Property Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Property Type *</Text>
        <View style={styles.propertyTypeGrid}>
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.propertyTypeButton,
                formData.propertyType === type.id && styles.propertyTypeButtonActive
              ]}
              onPress={() => handleInputChange('propertyType', type.id)}
            >
              <Ionicons 
                name={type.icon as any} 
                size={20} 
                color={formData.propertyType === type.id ? "white" : "#003366"} 
              />
              <Text style={[
                styles.propertyTypeText,
                formData.propertyType === type.id && styles.propertyTypeTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.propertyType && <Text style={styles.errorText}>{errors.propertyType}</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>Bedrooms</Text>
          <TextInput
            placeholder="2"
            value={formData.bedrooms}
            onChangeText={(value) => handleInputChange('bedrooms', value)}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Bathrooms</Text>
          <TextInput
            placeholder="2"
            value={formData.bathrooms}
            onChangeText={(value) => handleInputChange('bathrooms', value)}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>Size (sq ft)</Text>
          <TextInput
            placeholder="1200"
            value={formData.size}
            onChangeText={(value) => handleInputChange('size', value)}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Security Deposit</Text>
          <TextInput
            placeholder="90,000"
            value={formData.deposit}
            onChangeText={(value) => handleInputChange('deposit', value)}
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Lease Term</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.leaseTermScroll}>
          {leaseTerms.map((term) => (
            <TouchableOpacity
              key={term.id}
              style={[
                styles.leaseTermButton,
                formData.leaseTerm === term.id && styles.leaseTermButtonActive
              ]}
              onPress={() => handleInputChange('leaseTerm', term.id)}
            >
              <Text style={[
                styles.leaseTermText,
                formData.leaseTerm === term.id && styles.leaseTermTextActive
              ]}>
                {term.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={styles.toggleRow}
          onPress={() => handleInputChange('furnished', !formData.furnished)}
        >
          <Text style={styles.toggleLabel}>Furnished</Text>
          <View style={[
            styles.toggle,
            formData.furnished && styles.toggleActive
          ]}>
            <View style={[
              styles.toggleThumb,
              formData.furnished && styles.toggleThumbActive
            ]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.toggleRow}
          onPress={() => handleInputChange('petFriendly', !formData.petFriendly)}
        >
          <Text style={styles.toggleLabel}>Pet Friendly</Text>
          <View style={[
            styles.toggle,
            formData.petFriendly && styles.toggleActive
          ]}>
            <View style={[
              styles.toggleThumb,
              formData.petFriendly && styles.toggleThumbActive
            ]} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Available From</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={formData.availableFrom}
          onChangeText={(value) => handleInputChange('availableFrom', value)}
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>
    </Animated.View>
  );

  // Render step 3: Media & Amenities
  const renderStep3 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.sectionTitle}>Media & Amenities</Text>

      <Text style={styles.subtitle}>Photos ({images.length}/10)</Text>
      {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
      
      <View style={styles.mediaButtons}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImages}>
          <Ionicons name="images-outline" size={20} color="#0033A0" />
          <Text style={styles.mediaButtonText}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={20} color="#0033A0" />
          <Text style={styles.mediaButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {images.length > 0 && (
        <View style={styles.imagesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.previewImg} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
                <Text style={styles.imageNumber}>{index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Video Upload */}
      <Text style={styles.subtitle}>Video Tour (Optional)</Text>
      <TouchableOpacity 
        style={[styles.uploadButton, video && styles.uploadButtonSuccess]} 
        onPress={video ? removeVideo : pickVideo}
      >
        <Ionicons 
          name={video ? "checkmark-circle" : "videocam-outline"} 
          size={24} 
          color={video ? "#2e8b57" : "#fff"} 
        />
        <Text style={[styles.uploadText, video && styles.uploadTextSuccess]}>
          {video ? "Video Selected (Tap to remove)" : "Upload Video Tour"}
        </Text>
      </TouchableOpacity>

      {/* Amenities */}
      <Text style={styles.subtitle}>Select Amenities</Text>
      <View style={styles.amenitiesGrid}>
        {commonAmenities.map((amenity) => (
          <TouchableOpacity
            key={amenity}
            style={[
              styles.amenityButton,
              formData.amenities.includes(amenity) && styles.amenityButtonActive
            ]}
            onPress={() => toggleAmenity(amenity)}
          >
            <Ionicons 
              name={formData.amenities.includes(amenity) ? "checkmark-circle" : "ellipse-outline"} 
              size={16} 
              color={formData.amenities.includes(amenity) ? "#2e8b57" : "#666"} 
            />
            <Text style={[
              styles.amenityText,
              formData.amenities.includes(amenity) && styles.amenityTextActive
            ]}>
              {amenity}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>List Your Property</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      {isLoading && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>Uploading... {uploadProgress}%</Text>
        </View>
      )}

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Create an attractive listing to reach more tenants</Text>

        {/* Form Steps */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Pro Tips for Better Listings</Text>
          <Text style={styles.tip}>• Use high-quality, well-lit photos</Text>
          <Text style={styles.tip}>• Show all rooms and key features</Text>
          <Text style={styles.tip}>• Write a detailed, honest description</Text>
          <Text style={styles.tip}>• Set a competitive market price</Text>
          <Text style={styles.tip}>• Respond quickly to inquiries</Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.secondaryButton} onPress={prevStep}>
              <Ionicons name="arrow-back" size={18} color="#003366" />
              <Text style={styles.secondaryButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 3 ? (
            <TouchableOpacity style={styles.primaryButton} onPress={nextStep}>
              <Text style={styles.primaryButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.publishButton, 
                (!isFormValid || isLoading) && styles.publishButtonDisabled
              ]} 
              onPress={handlePublish}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={20} color="white" />
                  <Text style={styles.publishText}>
                    {isFormValid ? "Publish Listing" : "Complete All Fields"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003366",
    textAlign: "center",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: "#ff6b35",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#f8f9fa",
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  stepCircleActive: {
    backgroundColor: "#003366",
  },
  stepCircleCompleted: {
    backgroundColor: "#2e8b57",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  stepTextActive: {
    color: "white",
  },
  stepLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  stepLabelActive: {
    color: "#003366",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 20,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  inputError: {
    borderColor: "#ff4444",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  propertyTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  propertyTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flex: 1,
    minWidth: '30%',
    marginBottom: 10,
  },
  propertyTypeButtonActive: {
    backgroundColor: "#003366",
    borderColor: "#003366",
  },
  propertyTypeText: {
    fontSize: 12,
    color: "#003366",
    marginLeft: 6,
    fontWeight: "500",
  },
  propertyTypeTextActive: {
    color: "white",
  },
  leaseTermScroll: {
    flexGrow: 0,
  },
  leaseTermButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
  },
  leaseTermButtonActive: {
    backgroundColor: "#003366",
    borderColor: "#003366",
  },
  leaseTermText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  leaseTermTextActive: {
    color: "white",
  },
  toggleContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 14,
    color: "#003366",
    fontWeight: "500",
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
    padding: 2,
  },
  toggleActive: {
    backgroundColor: "#2e8b57",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    transform: [{ translateX: 0 }],
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  mediaButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#0033A0",
  },
  mediaButtonText: {
    color: "#0033A0",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  imagesSection: {
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  previewImg: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  imageNumber: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0033A0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  uploadButtonSuccess: {
    backgroundColor: "#e8f5e8",
    borderWidth: 1,
    borderColor: "#2e8b57",
  },
  uploadText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  uploadTextSuccess: {
    color: "#2e8b57",
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  amenityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  amenityButtonActive: {
    backgroundColor: "#f0f8ff",
    borderColor: "#0033A0",
  },
  amenityText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    fontWeight: "500",
  },
  amenityTextActive: {
    color: "#003366",
  },
  tipsContainer: {
    backgroundColor: "#f0f8ff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#0033A0",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#003366",
    fontWeight: "600",
    marginLeft: 8,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    marginRight: 8,
  },
  publishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6b35",
    padding: 18,
    borderRadius: 12,
    flex: 1,
    shadowColor: "#ff6b35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  publishButtonDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "#ccc",
  },
  publishText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});