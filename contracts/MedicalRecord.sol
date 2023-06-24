pragma solidity ^0.8.9;

import { ByteHasher } from "./helpers/ByteHasher.sol";
import { IWorldID } from "./interfaces/IWorldID.sol";

contract MedicalRecords {

    using ByteHasher for bytes;

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  ERRORS                                ///
    //////////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    /// @param _worldId The WorldID instance that will verify the proofs
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    struct Record {
        string userHash;
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

    modifier onlyContributor(string memory _userHash) {
        require(isContributor(_userHash), "Caller is not a contributor of the record");
        _;
    }

    modifier onlyOwner(string memory _userHash) {
        require(records[_userHash].ownerWallet == msg.sender, "Caller is not the record owner");
        _;
    }

    modifier recordExists(string memory _userHash) {
        require(records[_userHash].ownerWallet != address(0), "Record does not exist for the wallet");
        _;
    }

    // WRITE
    

    function createRecord(
        string memory _userHash,
        string memory _gender,
        string memory _birthday,
        int _heightCM,
        int _weightKG,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        require(records[_userHash].ownerWallet == address(0), "Record already exists for the caller");

        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // We now record the user has done this, so they can't do it again (proof of uniqueness)
        nullifierHashes[nullifierHash] = true;

        Record memory newRecord;

        newRecord.userHash = _userHash;
        newRecord.ownerWallet = msg.sender;
        newRecord.gender = _gender;
        newRecord.birthday = _birthday;
        newRecord.heightCM = _heightCM;
        newRecord.weightKG = _weightKG;
        newRecord.note = "";

        records[_userHash] = newRecord;
    }

    function modifyRecord(string memory _userHash, string memory _gender, int _heightCM, int _weightKG, string memory _note) public onlyContributor(_userHash) {
        records[_userHash].gender = _gender;
        records[_userHash].heightCM = _heightCM;
        records[_userHash].weightKG = _weightKG;
        records[_userHash].note = _note;
    }

    function changeWallet(
        string memory _userHash, 
        address _newAddress, 
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof) public onlyOwner(_userHash) {

        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // We now record the user has done this, so they can't do it again (proof of uniqueness)
        nullifierHashes[nullifierHash] = true;
        records[_userHash].ownerWallet = _newAddress;
    }

    // function addNote(string memory _userHash, address _author, string memory _datetime, string memory _content) public onlyContributor(_userHash) {

    //     Note memory newNote;
    //     newNote.author = _author;
    //     newNote.datetime = _datetime;
    //     newNote.content = _content;

    //     records[_userHash].notes.push(newNote);
    // }

    function setContributors(string memory _userHash, address[] memory _contributors) public onlyOwner(_userHash) {
        records[_userHash].contributors = _contributors;
    }

    function addImage(string memory _userHash, string memory _image) public onlyContributor(_userHash) {
        records[_userHash].images.push(_image);
    }

    // READ

    function hasRecord(string memory _userHash) public view returns (bool) {
        return records[_userHash].ownerWallet != address(0);
    }

    function isOwner(string memory _userHash) public view recordExists(_userHash) returns (bool) {
        if(records[_userHash].ownerWallet == msg.sender) {
            return true;
        }
        return false;
    }

    function isContributor(string memory _userHash) public view recordExists(_userHash) returns (bool) {
        if (isOwner(_userHash)) {
            return true;
        }

        for (uint256 i = 0; i < records[_userHash].contributors.length; i++) {
            if (records[_userHash].contributors[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function getRecord(string memory _userHash) public view onlyContributor(_userHash) returns (Record memory) {
        return records[_userHash];
    }

}
