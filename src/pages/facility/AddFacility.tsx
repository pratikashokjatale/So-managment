import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BackButton from "@/components/BackButton";
import { createFacilityApi } from "@/apis/facility";
import { uploadDocumentApi } from "@/apis/document";
import FacilityForm from "./components/form/FacilityForm";

export default function AddFacility() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    category: "Sports",
    price: "",
    capacity: "30",
    totalSlots: "1",
    bookedSlots: "0",
    managerName: "",
    managerContact: "",
    description: "",
    iconName: "SportsTennis",
    location: "Clubhouse",
    floor: "Ground Floor",
    openingTime: "10:00",
    closingTime: "22:00",
    allDay: false,
    availableDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    code: "",
    accessType: "SLOT_BOOKING",
    bookingMode: "SLOT",
    status: "OPERATIONAL",
    isActive: true,
    requiresApproval: false,
    rules: "",
    advanceBookingDays: "7",
    cancellationHours: "2",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Facility Name is required";
    if (formData.accessType !== "SUBSCRIPTION" && formData.accessType !== "MIXED" && !formData.price.trim()) {
      tempErrors.price = "Pricing Model is required";
    }
    if (formData.accessType !== "SUBSCRIPTION" && !formData.totalSlots) tempErrors.totalSlots = "Total Slots is required";
    if (!formData.capacity) tempErrors.capacity = "Capacity is required";
    if (!formData.managerName.trim()) tempErrors.managerName = "Manager Name is required";
    if (!formData.managerContact.trim()) tempErrors.managerContact = "Contact Number is required";
    if (!formData.description.trim()) tempErrors.description = "Description is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      let pricingModel = "CUSTOM";
      let finalPriceAmount: number | undefined = 0;
      let finalPriceLabel: string | undefined = formData.price;
      
      if (formData.accessType === "SUBSCRIPTION" || formData.accessType === "MIXED") {
        pricingModel = "INCLUDED";
        finalPriceAmount = undefined;
        finalPriceLabel = undefined;
      } else {
        const cleanPrice = formData.price.toLowerCase();
        if (cleanPrice.includes("included")) pricingModel = "INCLUDED";
        else if (cleanPrice.includes("free")) pricingModel = "FREE";
        else {
          if (cleanPrice.includes("hour") || cleanPrice.includes("hr")) pricingModel = "HOURLY";
          else if (cleanPrice.includes("show")) pricingModel = "SHOW";
          else if (cleanPrice.includes("session")) pricingModel = "SESSION";
          else if (cleanPrice.includes("day")) pricingModel = "DAY";
          const matchNum = formData.price.match(/\d+/);
          finalPriceAmount = matchNum ? parseInt(matchNum[0]) : 0;
        }
      }

      const parsedCapacity = parseInt(formData.capacity, 10) || 1;
      const parsedTotalSlots = formData.accessType === "SUBSCRIPTION" ? undefined : (parseInt(formData.totalSlots, 10) || 1);
      const parsedBookedSlots = parseInt(formData.bookedSlots, 10) || 0;

      let finalImages: string[] = [];
      if (formData.imageFile) {
        const uploadedUrl = await uploadDocumentApi(formData.imageFile);
        finalImages = [uploadedUrl];
      }

      const finalCode = formData.code.trim() || formData.name.toUpperCase().replace(/\s+/g, "-");
      const categoryUpper = formData.category.toUpperCase();

      let normalizedPhone = formData.managerContact.trim();
      if (normalizedPhone && !normalizedPhone.startsWith("+")) {
        normalizedPhone = `+91${normalizedPhone.replace(/^0+/, "")}`;
      }

      await createFacilityApi({
        name: formData.name,
        code: finalCode,
        category: categoryUpper,
        accessType: formData.accessType,
        iconKey: formData.iconName,
        description: formData.description,
        location: formData.location,
        floor: formData.floor,
        status: formData.status,
        isActive: formData.isActive,
        pricingModel,
        priceAmount: finalPriceAmount,
        priceCurrency: "INR",
        priceLabel: finalPriceLabel,
        bookingMode: formData.bookingMode,
        totalSlots: parsedTotalSlots,
        bookedSlots: parsedBookedSlots,
        capacity: parsedCapacity,
        openingTime: formData.allDay ? "00:00" : formData.openingTime,
        closingTime: formData.allDay ? "23:59" : formData.closingTime,
        availableDays: formData.availableDays,
        advanceBookingDays: parseInt(formData.advanceBookingDays, 10) || 7,
        cancellationHours: parseInt(formData.cancellationHours, 10) || 2,
        requiresApproval: formData.requiresApproval,
        managerName: formData.managerName,
        managerContact: normalizedPhone,
        rules: formData.rules,
        images: finalImages,
        sortOrder: 1,
      });

      toast.success("Facility created successfully!");
      navigate("/facility");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create facility");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, maxWidth: "850px", mx: "auto" }}>
          <Typography variant="h3" fontWeight="900" color="#091542" sx={{ letterSpacing: "-1px" }}>
            Add Facility
          </Typography>
          <BackButton to="/facility" />
        </Stack>

        <Box sx={{ maxWidth: "960px", mx: "auto" }}>
          <FacilityForm 
            data={formData} 
            onChange={handleChange} 
            onSubmit={handleSubmit} 
            errors={errors} 
            isLoading={isLoading} 
          />
        </Box>
      </Box>
    </Box>
  );
}
