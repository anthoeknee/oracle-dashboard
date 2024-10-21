from pydantic import BaseModel
from enum import Enum
from typing import List, Optional

class TraitType(str, Enum):
    EMOTION = "emotion"
    TRAIT = "trait"

class Trait(BaseModel):
    id: int
    name: str
    value: float
    type: TraitType

class PersonalityType(BaseModel):
    id: int
    name: str
    description: str

class Quirk(BaseModel):
    id: int
    name: str
    description: str

class BotPersonality(BaseModel):
    id: int
    name: str
    personality_type_id: int
    traits: List[Trait]
    quirks: List[Quirk]

class TraitUpdate(BaseModel):
    value: Optional[float] = None
    type: Optional[TraitType] = None

class BotPersonalityUpdate(BaseModel):
    name: Optional[str] = None
    personality_type_id: Optional[int] = None
    trait_ids: Optional[List[int]] = None
    quirk_ids: Optional[List[int]] = None
