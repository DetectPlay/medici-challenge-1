pragma solidity ^0.8.9;

contract MedicalRecords {

    constructor() {}

    struct record {
        string id;
        address patient;
        int age;
        string birthday;
        address[] owners;
        int heightCM;
        int weightKG;
        string info;
        string[] images;
    }

    struct person {
        string id;
        address adrs;
    }

    mapping(address => record) private records;

    modifier onlyContributor() {
        address from = msg.sender;
        require(isContributor(from), "Caller is not a contributor of the record");
        _;
    }

    modifier onlyPatient() {
        address from = msg.sender;
        require(records[from].patient == from, "Caller is not the patient of the record");
        _;
    }

    modifier recordExists(address _address) {
        require(records[_address].patient != address(0), "Record does not exist for the patient");
        _;
    }

    function getRecord() public view recordExists(msg.sender) returns (record memory) {
        address from = msg.sender;
        return records[from];
    }

    function isContributor(address _address) public view recordExists(msg.sender) returns (bool) {
        address from = msg.sender;
        if(records[from].patient == from) {
            return true;
        }
        for (uint256 i = 0; i < records[from].owners.length; i++) {
            if (records[from].owners[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function createRecord(
    string memory uuid,
    int age,
    string memory birthday,
    int heightCM,
    int weightKG
    ) public {
        address from = msg.sender;
        require(records[from].patient == address(0), "Record already exists for the caller");

        record memory newRecord;
        newRecord.id = uuid; // Set the provided UUID as the ID
        newRecord.patient = from; // Set the patient as the caller's address
        newRecord.age = age; // Initialize the age
        newRecord.birthday = birthday; // Initialize the birthday
        newRecord.heightCM = heightCM; // Initialize the height
        newRecord.weightKG = weightKG; // Initialize the weight

        records[from] = newRecord;
    }

    function updateAge(int256 newAge) public onlyContributor recordExists(msg.sender) {
        address from = msg.sender;
        records[from].age = newAge;
    }

    function updateBirthday(string memory newBirthday) public onlyContributor recordExists(msg.sender) {
        address from = msg.sender;
        records[from].birthday = newBirthday;
    }

    function updateHeight(int256 newHeightCM) public onlyContributor recordExists(msg.sender) {
        address from = msg.sender;
        records[from].heightCM = newHeightCM;
    }

    function updateWeight(int256 newWeightKG) public onlyContributor recordExists(msg.sender) {
        address from = msg.sender;
        records[from].weightKG = newWeightKG;
    }

    function updateInfo(string memory newInfo) public onlyContributor recordExists(msg.sender) {
        address from = msg.sender;
        records[from].info = newInfo;
    }

    function addContributor(address contributor) public onlyPatient {
        address from = msg.sender;
        records[from].owners.push(contributor);
    }
    
    function removeContributor(address contributor) public onlyPatient {
        address from = msg.sender;
        uint length = records[from].owners.length;
        
        for (uint i = 0; i < length; i++) {
            if (records[from].owners[i] == contributor) {
                if (i != length - 1) {
                    records[from].owners[i] = records[from].owners[length - 1];
                }
                records[from].owners.pop();
                break;
            }
        }
    }
    
    function addImage(string memory image) public onlyContributor recordExists(msg.sender) {
        address from = msg.sender;
        records[from].images.push(image);
    }

    function hasRecord() public view returns (bool) {
        address from = msg.sender;
        return records[from].patient != address(0);
    }
}
