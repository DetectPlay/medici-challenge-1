pragma solidity ^0.8.9;

contract MedicalRecords {

    constructor() {}

    struct Record {
        string worldId;
        address ownerWallet;
        string gender;
        string birthday;
        int heightCM;
        int weightKG;
        address[] contributors;
        string note;
        string[] images;
    }

    struct Note {
        address author;
        string datetime;
        string content;
    }

    mapping(string => Record) private records; // World ID to record

    // PREREQ CHECKS

    modifier onlyContributor(string memory _worldId) {
        require(isContributor(_worldId), "Caller is not a contributor of the record");
        _;
    }

    modifier onlyOwner(string memory _worldId) {
        require(records[_worldId].ownerWallet == msg.sender, "Caller is not the record owner");
        _;
    }

    modifier recordExists(string memory _worldId) {
        require(records[_worldId].ownerWallet != address(0), "Record does not exist for the wallet");
        _;
    }

    // WRITE
    

    function createRecord(
        string memory _worldId,
        string memory _gender,
        string memory _birthday,
        int _heightCM,
        int _weightKG
    ) public {
        require(records[_worldId].ownerWallet == address(0), "Record already exists for the caller");

        Record memory newRecord;

        newRecord.worldId = _worldId;
        newRecord.ownerWallet = msg.sender;
        newRecord.gender = _gender;
        newRecord.birthday = _birthday;
        newRecord.heightCM = _heightCM;
        newRecord.weightKG = _weightKG;
        newRecord.note = "";

        records[_worldId] = newRecord;
    }

    function modifyRecord(string memory _worldId, string memory _gender, int _heightCM, int _weightKG, string memory _note) public onlyContributor(_worldId) {
        records[_worldId].gender = _gender;
        records[_worldId].heightCM = _heightCM;
        records[_worldId].weightKG = _weightKG;
        records[_worldId].note = _note;
    }

    function changeWallet(string memory _worldId, address _newAddress) public onlyOwner(_worldId) {
        records[_worldId].ownerWallet = _newAddress;
    }

    // function addNote(string memory _worldId, address _author, string memory _datetime, string memory _content) public onlyContributor(_worldId) {

    //     Note memory newNote;
    //     newNote.author = _author;
    //     newNote.datetime = _datetime;
    //     newNote.content = _content;

    //     records[_worldId].notes.push(newNote);
    // }

    function setContributors(string memory _worldId, address[] memory _contributors) public onlyOwner(_worldId) {
        records[_worldId].contributors = _contributors;
    }

    function addImage(string memory _worldId, string memory _image) public onlyContributor(_worldId) {
        records[_worldId].images.push(_image);
    }

    // READ

    function hasRecord(string memory _worldId) public view returns (bool) {
        return records[_worldId].ownerWallet != address(0);
    }

    function isOwner(string memory _worldId) public view recordExists(_worldId) returns (bool) {
        if(records[_worldId].ownerWallet == msg.sender) {
            return true;
        }
        return false;
    }

    function isContributor(string memory _worldId) public view recordExists(_worldId) returns (bool) {
        if (isOwner(_worldId)) {
            return true;
        }

        for (uint256 i = 0; i < records[_worldId].contributors.length; i++) {
            if (records[_worldId].contributors[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function getRecord(string memory _worldId) public view onlyContributor(_worldId) returns (Record memory) {
        return records[_worldId];
    }

}
