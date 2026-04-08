exports.getFollowers = async (req, res) => {
  try {
    const followersResponse = await fetch(`${process.env.SOCIAL_SERVICE_URL}/followers/${req.userId}`);

    if (!followersResponse.ok) {
      return res.status(503).json({ error: 'Social service unavailable.' });
    }

    const followers = await followersResponse.json();

    if (followers.length === 0) {
      return res.status(200).json([]);
    }

    const usersResponses = await Promise.all(
      followers.map(follower =>
        fetch(`${process.env.USER_SERVICE_URL}/${follower.userId}`).then(r => r.json())
      )
    );

    // Récupérer la liste des personnes que l'utilisateur suit
    const followingResponse = await fetch(`${process.env.SOCIAL_SERVICE_URL}/friends/${req.userId}`);
    const following = await followingResponse.json();
    const followingIds = following.map(f => f.friendId);

    const result = usersResponses.map((user, index) => ({
      id:        user.id,
      username:  user.username,
      firstName: user.firstName,
      lastName:  user.lastName,
      avatar:    user.avatar,
      bio:       user.bio,
      isFollowingBack: followingIds.includes(user.id),
    }));

    return res.status(200).json(result);

  }
  catch (error) {
    console.error('❌ [getFollowers] Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Récupérer les followers d'un utilisateur spécifique
exports.getFollowersOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔵 [getFollowersOfUser] userId:', userId);
    
    const followersResponse = await fetch(`${process.env.SOCIAL_SERVICE_URL}/followers/${userId}`);

    if (!followersResponse.ok) {
      return res.status(503).json({ error: 'Social service unavailable.' });
    }

    const followers = await followersResponse.json();
    console.log('🔵 [getFollowersOfUser] Nombre de followers:', followers.length);

    if (followers.length === 0) {
      return res.status(200).json([]);
    }

    const usersResponses = await Promise.all(
      followers.map(follower =>
        fetch(`${process.env.USER_SERVICE_URL}/${follower.userId}`).then(r => r.json())
      )
    );

    const result = usersResponses.map(user => ({
      id:        user.id,
      username:  user.username,
      firstName: user.firstName,
      lastName:  user.lastName,
      avatar:    user.avatar,
    }));

    console.log('✅ [getFollowersOfUser] Réponse:', result.length, 'followers');
    return res.status(200).json(result);

  }
  catch (error) {
    console.error('❌ [getFollowersOfUser] Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getFriends = async (req, res) => {
  try {
    console.log('🔵 [getFriends] Requête pour userId:', req.userId);
    const friendsResponse = await fetch(`${process.env.SOCIAL_SERVICE_URL}/friends/${req.userId}`);

    if (!friendsResponse.ok) {
      console.log('❌ [getFriends] Social service unavailable:', friendsResponse.status);
      return res.status(503).json({ error: 'Social service unavailable.' });
    }

    const friends = await friendsResponse.json();
    console.log('🔵 [getFriends] Nombre d\'amis trouvés:', friends?.length || 0);

    if (friends.length === 0) {
      console.log('✅ [getFriends] Aucun ami');
      return res.status(200).json([]);
    }

    const usersResponses = await Promise.all(
      friends.map(friend =>
        fetch(`${process.env.USER_SERVICE_URL}/${friend.friendId}`).then(r => r.json())
      )
    );

    // Récupérer la liste des followers pour vérifier les relations mutuelles
    const followersResponse = await fetch(`${process.env.SOCIAL_SERVICE_URL}/followers/${req.userId}`);
    const followers = await followersResponse.json();
    const followerIds = followers.map(f => f.userId);

    const result = usersResponses.map(user => ({
      id:        user.id,
      username:  user.username,
      firstName: user.firstName,
      lastName:  user.lastName,
      avatar:    user.avatar,
      bio:       user.bio,
      followsMe: followerIds.includes(user.id),
    }));

    console.log('✅ [getFriends] Réponse avec', result.length, 'amis');
    return res.status(200).json(result);

  }
  catch (error) {
    console.error('❌ [getFriends] Exception:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Récupérer les friends (following) d'un utilisateur spécifique
exports.getFriendsOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔵 [getFriendsOfUser] userId:', userId);
    
    const friendsResponse = await fetch(`${process.env.SOCIAL_SERVICE_URL}/friends/${userId}`);

    if (!friendsResponse.ok) {
      return res.status(503).json({ error: 'Social service unavailable.' });
    }

    const friends = await friendsResponse.json();
    console.log('🔵 [getFriendsOfUser] Nombre d\'amis:', friends.length);

    if (friends.length === 0) {
      return res.status(200).json([]);
    }

    const usersResponses = await Promise.all(
      friends.map(friend =>
        fetch(`${process.env.USER_SERVICE_URL}/${friend.friendId}`).then(r => r.json())
      )
    );

    const result = usersResponses.map(user => ({
      id:        user.id,
      username:  user.username,
      firstName: user.firstName,
      lastName:  user.lastName,
      avatar:    user.avatar,
    }));

    console.log('✅ [getFriendsOfUser] Réponse:', result.length, 'friends');
    return res.status(200).json(result);

  }
  catch (error) {
    console.error('❌ [getFriendsOfUser] Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('🔵 [followUser] Tentative follow:');
    console.log('  - currentUserId (req.userId):', req.userId);
    console.log('  - userId (à follow):', userId);

    if (req.userId === userId) {
      console.log('❌ [followUser] PREVENT SELF-FOLLOW: Les deux IDs sont identiques!');
      return res.status(400).json({ error: 'You cannot follow yourself.' });
    }

    const userCheckResponse = await fetch(`${process.env.USER_SERVICE_URL}/${userId}`);

    if (userCheckResponse.status === 404) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!userCheckResponse.ok) {
      return res.status(503).json({ error: 'User service unavailable.' });
    }

    console.log('🔵 [followUser] User existe, envoi au SOCIAL_SERVICE...');
    const socialResponse = await fetch(`${process.env.SOCIAL_SERVICE_URL}/`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId:   req.userId,
        friendId: userId,
      }),
    });

    console.log('🔵 [followUser] Réponse status:', socialResponse.status);
    const responseData = await socialResponse.text();
    console.log('🔵 [followUser] Réponse body:', responseData);

    if (socialResponse.status === 409) {
      console.log('⚠️ [followUser] Déjà en train de suivre');
      return res.status(409).json({ error: 'Already following this user.' });
    }

    if (!socialResponse.ok) {
      console.log('❌ [followUser] Erreur:', socialResponse.status);
      return res.status(503).json({ error: 'Social service unavailable.' });
    }

    console.log('✅ [followUser] Follow réussi');
    return res.status(201).json({ success: true });

  }
  catch (error) {
    console.error('❌ [followUser] Exception:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId: friendId } = req.params;
    console.log('🔵 [unfollowUser] Tentative unfollow:');
    console.log('  - currentUserId (req.userId):', req.userId);
    console.log('  - friendId (à unfollow):', friendId);

    if (req.userId === friendId) {
      return res.status(400).json({ error: 'You cannot unfollow yourself.' });
    }

    const deleteUrl = `${process.env.SOCIAL_SERVICE_URL}/user/${req.userId}/friend/${friendId}`;
    console.log('🔵 [unfollowUser] URL de suppression:', deleteUrl);

    const socialResponse = await fetch(deleteUrl, {
      method: 'DELETE',
    });

    console.log('🔵 [unfollowUser] Réponse status:', socialResponse.status);
    const responseData = await socialResponse.text();
    console.log('🔵 [unfollowUser] Réponse body:', responseData);

    if (socialResponse.status === 404) {
      console.log('❌ [unfollowUser] 404 - You are not following this user.');
      return res.status(404).json({ error: 'You are not following this user.' });
    }

    if (!socialResponse.ok) {
      console.log('❌ [unfollowUser] Erreur:', socialResponse.status, responseData);
      return res.status(503).json({ error: 'Social service unavailable.' });
    }

    console.log('✅ [unfollowUser] Unfollow réussi');
    return res.status(200).json({ success: true });
  }
  catch (error) {
    console.error('❌ [unfollowUser] Exception:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};