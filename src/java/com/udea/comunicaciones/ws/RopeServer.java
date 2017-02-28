/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.udea.comunicaciones.ws;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author daniel
 */
@ServerEndpoint("/rope")
public class RopeServer {
    private static final Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());
    private Session player1=null, player2=null;
    @OnOpen
    public void onOpen(Session peer) throws IOException, EncodeException{
        if(peer.getOpenSessions().size()==1){
            player1=(Session)peer.getOpenSessions().toArray()[0];
            player1.getBasicRemote().sendObject("1");
            peers.add(peer);
            System.out.println("1hola");
        }else if(peer.getOpenSessions().size()==2){
            player2=(Session)peer.getOpenSessions().toArray()[1];
            player2.getBasicRemote().sendObject("2");
            peers.add(peer);
            System.out.println("2hola");
        }else{
            System.out.println("3hola");
            peer.getBasicRemote().sendObject("3");
            peer.close();    
        }
    }
    @OnMessage
    public void onMessage(String message, Session client) throws IOException, EncodeException {
        if(message.equals("32")){
            if(player1!=null){
                for(Session peer:peers){
                    peer.getBasicRemote().sendObject("37");
                }
            }else{
                for(Session peer:peers){
                    peer.getBasicRemote().sendObject("39");
                }
            }
        }else if(message.equals("13")){
            if(player1==null){
                for(Session peer:peers){
                    peer.getBasicRemote().sendObject("13");
                }
            }
        }else{
            for(Session peer:peers){
                peer.getBasicRemote().sendObject(message);
            }
        }
    }
    @OnClose
    public void onClose(Session peer) throws IOException, EncodeException{
        peers.remove(peer);
        player1=null;
        player2=null;
    }
    
}
