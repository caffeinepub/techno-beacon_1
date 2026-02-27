import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Data Structure
  public type UserProfile = {
    name : Text;
  };

  // Artist Data Structure
  type Artist = {
    id : Text;
    name : Text;
    genre : Text;
    imageUrl : Text;
    bio : Text;
  };

  // Event Data Structure
  type Event = {
    id : Text;
    title : Text;
    artistId : Text;
    venue : Text;
    city : Text;
    date : Text;
    ticketUrl : Text;
    source : Text;
  };

  // Radar Summary Data Structure
  type RadarSummary = {
    savedEventsCount : Nat;
    trackedArtistsCount : Nat;
  };

  // Persistent Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let artistsMap = Map.empty<Text, Artist>();
  let eventsMap = Map.empty<Text, Event>();
  let userTrackedArtistsMap = Map.empty<Principal, List.List<Text>>();
  let userRadarEventsMap = Map.empty<Principal, List.List<Text>>();

  // USER PROFILE FUNCTIONS
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ARTIST FUNCTIONS
  public query ({ caller }) func getAllArtists() : async [Artist] {
    artistsMap.values().toArray();
  };

  public query ({ caller }) func getArtistById(id : Text) : async ?Artist {
    artistsMap.get(id);
  };

  public shared ({ caller }) func seedArtists(artists : [Artist]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can seed artists");
    };
    for (artist in artists.values()) {
      artistsMap.add(artist.id, artist);
    };
  };

  public shared ({ caller }) func toggleTrackArtist(artistId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can track artists");
    };

    if (not artistsMap.containsKey(artistId)) {
      Runtime.trap("Artist does not exist");
    };

    let currentTracked = switch (userTrackedArtistsMap.get(caller)) {
      case (null) {
        let newList = List.empty<Text>();
        userTrackedArtistsMap.add(caller, newList);
        newList;
      };
      case (?tracked) { tracked };
    };

    let existingList = currentTracked.toArray();
    let alreadyTracking = existingList.find(func(id) { id == artistId });

    switch (alreadyTracking) {
      case (null) {
        currentTracked.add(artistId);
      };
      case (?_) {
        let filtered = List.fromArray(existingList.filter(func(x) { x != artistId }));
        userTrackedArtistsMap.add(caller, filtered);
      };
    };
  };

  public query ({ caller }) func getTrackedArtists() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tracked artists");
    };
    switch (userTrackedArtistsMap.get(caller)) {
      case (null) { [] };
      case (?tracked) { tracked.toArray() };
    };
  };

  // EVENT FUNCTIONS
  public query ({ caller }) func getAllEvents() : async [Event] {
    eventsMap.values().toArray();
  };

  public query ({ caller }) func getEventsByArtistId(artistId : Text) : async [Event] {
    let iter = eventsMap.values();
    let filtered = iter.filter(func(e) { e.artistId == artistId });
    filtered.toArray();
  };

  public query ({ caller }) func getEventsByTrackedArtists() : async [Event] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view events by tracked artists");
    };
    let trackedArtists = switch (userTrackedArtistsMap.get(caller)) {
      case (null) { return [] };
      case (?tracked) { tracked.toArray() };
    };

    let iter = eventsMap.values();
    let filtered = iter.filter(
      func(e) { trackedArtists.find(func(id) { id == e.artistId }) != null }
    );
    filtered.toArray();
  };

  public shared ({ caller }) func seedEvents(events : [Event]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can seed events");
    };
    for (event in events.values()) {
      eventsMap.add(event.id, event);
    };
  };

  // RADAR FUNCTIONS
  public shared ({ caller }) func addEventToRadar(eventId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to radar");
    };

    if (not eventsMap.containsKey(eventId)) {
      Runtime.trap("Event does not exist");
    };

    let currentRadar = switch (userRadarEventsMap.get(caller)) {
      case (null) {
        let newList = List.empty<Text>();
        userRadarEventsMap.add(caller, newList);
        newList;
      };
      case (?radar) { radar };
    };

    let existingRadar = currentRadar.toArray();
    if (existingRadar.find(func(id) { id == eventId }) == null) {
      currentRadar.add(eventId);
    };
  };

  public shared ({ caller }) func removeEventFromRadar(eventId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from radar");
    };

    switch (userRadarEventsMap.get(caller)) {
      case (null) {};
      case (?radar) {
        let newRadar = List.empty<Text>();
        for (id in radar.values()) {
          if (id != eventId) {
            newRadar.add(id);
          };
        };
        userRadarEventsMap.add(caller, newRadar);
      };
    };
  };

  public query ({ caller }) func getRadarEvents() : async [Event] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view radar events");
    };
    switch (userRadarEventsMap.get(caller)) {
      case (null) { [] };
      case (?radar) {
        let events = radar.toArray();
        let fullEvents = List.empty<Event>();

        func addValidEvent(eventId : Text) {
          switch (eventsMap.get(eventId)) {
            case (?event) { fullEvents.add(event) };
            case (null) {};
          };
        };

        for (eventId in events.values()) { addValidEvent(eventId) };
        fullEvents.toArray();
      };
    };
  };

  public query ({ caller }) func getRadarSummary() : async RadarSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view radar summary");
    };
    let savedEventsCount = switch (userRadarEventsMap.get(caller)) {
      case (null) { 0 };
      case (?radar) { radar.size() };
    };
    let trackedArtistsCount = switch (userTrackedArtistsMap.get(caller)) {
      case (null) { 0 };
      case (?tracked) { tracked.size() };
    };
    {
      savedEventsCount;
      trackedArtistsCount;
    };
  };
};
