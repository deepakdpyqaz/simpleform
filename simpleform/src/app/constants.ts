const priceList = {
    "FRWA": {
        "2AB": 14600,
        "3AB": 12600,
        "4AB": 13600,
        "6NAB": 6000,
    },
    "FRWOA":{
        "charges":3000,
        "foodFees":{
            "REGULAR": 2600,
            "VEGAN": 2600,
            "GLUTEN_FREE": 2600,
            "NONE": 0
        }
    },
    "PR":{
        "foodFees":{
            "REGULAR": 450,
            "VEGAN": 450,
            "GLUTEN_FREE": 450,
            "NONE": 0
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
    Male = "male",
    Female = "female"
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