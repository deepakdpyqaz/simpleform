const priceList = {
    "FRWA": {
        "2AB": 14600,
        "3AB": 12600,
        "4AB": 13600,
        "6NAB": 6000,
    },
    "FRWOA":{
        "withFood": 5600,
        "withoutFood": 3000,
    },
    "PR":{
        "foodFees":{
            "REGULAR": 450,
            "VEGAN": 450,
            "GLUTEN_FREE": 450,
        },
        "partialRegistrationCharges":450
    },
    "arrivalLunch": 200,
    "departureLunch": 200

}
enum AccommodationType {
    Room = "Room",
    Dormatory = "Dormatory"
}

enum TravelType {
    Individual = "Individual",
    Group = "Group"
}

enum YesNoType {
    Yes = "Yes",
    No = "No"
}

enum GenderType {
    Male = "Male",
    Female = "Female"
}

enum BedType {
    AB2 = "2AB",
    AB3 = "3AB",
    AB4 = "4AB",
    NAB6 = "6NAB",
}

enum OperationType {
    Increase = "Increase",
    Decrease = "Decrease"
}

enum SubmitStatus {
    Pending,
    Submitted,
    Failed,
    InProgress
}

enum RegistrationType {
    FRWA = "FRWA", // Full registration with accommodation
    FRWOA = "FRWOA", // Full registration without accommodation
    PR = "PR", // Partial registration
}

enum FoodType {
    REGULAR = "REGULAR",
    VEGAN = "VEGAN",
    GLUTEN_FREE = "GLUTEN_FREE",
    NONE = "NONE",
}
export { priceList, AccommodationType, TravelType, YesNoType, GenderType, BedType, OperationType, SubmitStatus, RegistrationType, FoodType };