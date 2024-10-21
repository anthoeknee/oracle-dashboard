from fastapi import APIRouter, HTTPException, Depends
from typing import List
from src.models.personality import Trait, TraitUpdate, PersonalityType, Quirk, BotPersonality, BotPersonalityUpdate
from src.database.supabase_client import supabase
from src.websocket.connection_manager import manager
from src.auth.auth_bearer import JWTBearer

router = APIRouter()

# Add JWTBearer dependency to all routes
jwt_bearer = Depends(JWTBearer())

# Trait routes
@router.get("/traits", response_model=List[Trait], dependencies=[jwt_bearer])
async def get_all_traits():
    response = supabase.table("traits").select("*").execute()
    return response.data

@router.put("/traits/{trait_id}", response_model=Trait, dependencies=[jwt_bearer])
async def update_trait(trait_id: int, trait: TraitUpdate):
    response = supabase.table("traits").update(trait.dict(exclude_unset=True)).eq("id", trait_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Trait not found")
    await manager.broadcast("traitsUpdated")
    return response.data[0]

# PersonalityType routes
@router.get("/personality-types", response_model=List[PersonalityType], dependencies=[jwt_bearer])
async def get_all_personality_types():
    response = supabase.table("personality_types").select("*").execute()
    return response.data

# Quirk routes
@router.get("/quirks", response_model=List[Quirk], dependencies=[jwt_bearer])
async def get_all_quirks():
    response = supabase.table("quirks").select("*").execute()
    return response.data

# BotPersonality routes
@router.get("/bot-personalities", response_model=List[BotPersonality], dependencies=[jwt_bearer])
async def get_all_bot_personalities():
    response = supabase.table("bot_personalities").select("*").execute()
    return response.data

@router.get("/bot-personalities/{bot_personality_id}", response_model=BotPersonality, dependencies=[jwt_bearer])
async def get_bot_personality(bot_personality_id: int):
    response = supabase.table("bot_personalities").select("*").eq("id", bot_personality_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Bot personality not found")
    return response.data[0]

@router.put("/bot-personalities/{bot_personality_id}", response_model=BotPersonality, dependencies=[jwt_bearer])
async def update_bot_personality(bot_personality_id: int, bot_personality: BotPersonalityUpdate):
    if bot_personality.trait_ids is not None:
        # Verify that all trait_ids exist
        trait_response = supabase.table("traits").select("id").in_("id", bot_personality.trait_ids).execute()
        if len(trait_response.data) != len(bot_personality.trait_ids):
            raise HTTPException(status_code=400, detail="One or more trait_ids do not exist")

    if bot_personality.quirk_ids is not None:
        # Verify that all quirk_ids exist
        quirk_response = supabase.table("quirks").select("id").in_("id", bot_personality.quirk_ids).execute()
        if len(quirk_response.data) != len(bot_personality.quirk_ids):
            raise HTTPException(status_code=400, detail="One or more quirk_ids do not exist")

    # Update the bot personality
    response = supabase.table("bot_personalities").update(bot_personality.dict(exclude_unset=True)).eq("id", bot_personality_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Bot personality not found")
    return response.data[0]
