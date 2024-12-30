const priceList = {
    basePrice: 1000,
    perRoom: 1000,
    perDormatory: 700,
    extraBedRoom: 800, // Three people
    foodFees: 100,
    arrivalLunch: 100,
    departureLunch: 100

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

enum GenderType{
    Male = "Male",
    Female = "Female"
}

enum BedType{
    AB2 = "2AB",
    AB3 = "3AB",
    AB4 = "4AB",
    NAB6 = "6NAB",
}

enum OperationType{
    Increase = "Increase",
    Decrease = "Decrease"
}
export {priceList, AccommodationType, TravelType, YesNoType, GenderType, BedType, OperationType};