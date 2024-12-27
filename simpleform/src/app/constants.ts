const priceList = {
    basePrice: 1000,
    perRoom: 1000,
    perDormatory: 700,
    extraBedRoom: 2800, // Three people
    foodFees: 1000,
}
enum AccomodationType {
    Room = "room",
    Dormatory = "dormatory"
}

enum TravelType {
    Individual = "individual",
    Group = "group"
}

enum YesNoType {
    Yes = "yes",
    No = "no"
}

enum GenderType{
    Male = "male",
    Female = "female"
}
export {priceList, AccomodationType, TravelType, YesNoType, GenderType};