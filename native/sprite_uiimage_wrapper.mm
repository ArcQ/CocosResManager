//
//  testWrapper.m
//  minOne
//
//  Created by Eddie Law on 2016-01-28.
//
//
#import "/Users/eddielaw/Development/Current/minOne/src/main/resource_iOS.h"

#import "sprite_uiimage_wrapper.h"

char* sprite_uiimage_wrapper::getByte()
{
    return (char*)[resource_iOS getBytes];
}

int sprite_uiimage_wrapper::getLength()
{
    return (int)[resource_iOS getLen];
}

